import * as $ from "@dz-ssbm/util";
import * as GQL from "@dz-ssbm/gql";
import { type Client as GQLClient } from "@dz-ssbm/gql/T";
import * as Q from "../queries.js";
import * as T from "../types.js";
import * as U from "../util.js";

function* getBaseGGEventData(): T.H2HBuilder<Q.TourneyOpData> {
  const client = yield* $.xRead("client");
  const opts = yield* $.xRead("opts");
  const slug = yield* $.xRead("slug");
  function getEventData(op: Q.TourneyOp, nwc?: GQL.NetworkControl) {
    const fullOpts = { ...opts, networkControl: nwc || opts.networkControl };
    const pageSpecs = {
      pageE: (d: Q.TourneyOpData) => d.event.entrants,
      pageS: (d: Q.TourneyOpData) => d.event.standings,
    };
    return () => U.ggQueryAll(client, op, { slug }, pageSpecs, fullOpts);
  }
  return yield* $.xFirst(
    getEventData(Q.tourneyOp, GQL.NetworkControl.cacheOnly),
    getEventData(Q.tourneyOpSmall, GQL.NetworkControl.cacheOnly),
    getEventData(Q.tourneyOp),
    getEventData(Q.tourneyOpSmall),
  );
}

function* getSetsData(id: number): T.H2HBuilder<Q.SetsOpData["phaseGroup"]> {
  const client = yield* $.xRead("client");
  const opts = yield* $.xRead("opts");
  const pageSpecs = { page: (d: Q.SetsOpData) => d.phaseGroup.sets };
  const vars = { phaseGroupId: id };
  const data = yield* U.ggQueryAll(client, Q.setsOp, vars, pageSpecs, opts);
  return data.phaseGroup;
}
function* getGGEventDataImpl(): T.H2HBuilder<T.H2HEvent> {
  const { event } = yield* getBaseGGEventData();

  const entrants: Record<string | number, T.H2HEntrant> = {};
  const phaseGroups: T.H2HPhaseGroup[] = [];
  const entrantNodes = event.entrants.nodes;
  const numEntrants = entrantNodes.length;

  for (const entrantNode of entrantNodes) {
    const participants: T.H2HParticipant[] = [];
    for (const ptc of entrantNode.participants) {
      const player = ptc.player;
      const playerBase = {
        gamerTag: player.gamerTag,
        name: player.user?.name || player.gamerTag,
        id: player.id,
        prefix: player.prefix,
        pronouns: player.user?.genderPronoun,
      };
      participants.push({ ...playerBase, player: { ...playerBase } });
      const entrantId = entrantNode.id;
      entrants[entrantId] ||= {
        id: entrantId,
        participants,
        player: { ...playerBase },
        standing: { placement: 0, isFinal: false },
      };
    }
  }

  for (const { entrant, ...standing } of event.standings.nodes) {
    entrants[entrant.id]!.standing = standing;
  }

  const eventImages = event.tournament.images;
  const eventProfileImages = eventImages.filter((i) => i.type === "profile");

  function scoreOf(displayScore?: string) {
    const res = parseInt(displayScore || "");
    return Number.isNaN(res) ? undefined : res;
  }

  function getPlayer(entrantId?: string | number) {
    const entrant = entrants[entrantId || ""] || { player: undefined };
    return entrant.player;
  }

  function getDisplayName(entrantId?: string | number) {
    const { gamerTag, prefix } = getPlayer(entrantId) || {};
    return [prefix ? `${prefix} | ` : "", gamerTag].join("");
  }

  function getPlayerId(entrantId?: string | number) {
    const player = getPlayer(entrantId) || { id: undefined };
    return player.id;
  }

  function mkSlot(entrantId?: string | number, score?: string): T.H2HSlot {
    return {
      entrant: entrantId ? { id: entrantId } : undefined,
      playerId: getPlayerId(entrantId),
      score: scoreOf(score),
      displayScore: score,
    };
  }

  const eventPhaseGroups = [...event.phaseGroups];
  eventPhaseGroups.sort((g1, g2) => g1.phase.phaseOrder - g2.phase.phaseOrder);
  for (const phaseGroup of eventPhaseGroups) {
    const setsById: Record<string | number, T.H2HSet> = {};
    const { id: phaseGroupId, phase, displayIdentifier } = phaseGroup;
    const { bracketType, sets } = yield* getSetsData(phaseGroupId);
    console.log(phaseGroup, bracketType, sets);
    for (const set of sets.nodes) {
      const hasWinner = !!set.winnerId;
      const isDQ = set.displayScore === "DQ";
      let isBye = false;
      for (const slot of set.slots) {
        if (!slot.entrant) {
          isBye = true;
          break;
        }
      }
      const [slot1, slot2] = set.slots;
      const slot1EntrantId = set.slots[0]?.entrant?.id;
      const slot2EntrantId = set.slots[1]?.entrant?.id;
      const [slot1Score = "", slot2Score = ""] = (() => {
        const games = set.games || [];
        if (games.length) {
          const doneGamesL = games.filter((g) => !!g.winnerId);
          const w1GamesL = games.filter((g) => g.winnerId === slot1EntrantId);
          const w1 = `${w1GamesL.length}`;
          const w2 = `${doneGamesL.length - w1GamesL.length}`;
          return [w1, w2];
        }

        if (set.displayScore === "DQ") {
          return set.winnerId == slot1?.entrant?.id ? ["-", "DQ"] : ["DQ", "-"];
        }
        if (!set.displayScore) {
          return ["", ""];
        }

        const s2m = [...set.displayScore.matchAll(/ (\d+)$/g)];
        if (s2m.length === 1) {
          const s2 = s2m[0]?.[1];
          const s1m = [...set.displayScore.matchAll(/ (\d+) -/g)];
          if (s1m.length === 1) {
            return [s1m[0]?.[1], s2];
          }
        }
        return (set.displayScore.split(getDisplayName(slot1EntrantId))[1] || "")
          .split("- " + getDisplayName(slot2EntrantId))
          .map((s) => s.trim());
      })();

      setsById[set.id] = {
        id: set.id,
        slots: [
          mkSlot(slot1?.entrant?.id, slot1Score),
          mkSlot(slot2?.entrant?.id, slot2Score),
        ],
        round: set.round,
        fullRoundText: set.fullRoundText,
        isDQ,
        isBye,
        displayScore: set.displayScore,
        winnerId: set.winnerId,
        doesCount: !isBye && !isDQ && hasWinner,
        isLosers: set.round < 0,
        isGrands: set.fullRoundText.includes("Grand"),
        // TODO
        depth: 0,
        isDropRound: false,
      };
    }
    phaseGroups.push({
      id: phaseGroupId,
      displayIdentifier,
      sets: setsById,
      phase: {
        id: phase.id,
        name: phase.name,
        phaseOrder: phase.phaseOrder,
      },
    });
  }

  return {
    id: event.id,
    bracketingSite: "startgg",
    tournamentName: event.tournament.name,
    date: event.tournament.endAt,
    entrants: entrants,
    imageUrl: eventProfileImages[0]?.url,
    tournament: {
      id: event.tournament.id,
      name: event.tournament.name,
      endAt: event.tournament.endAt,
      images: event.tournament.images,
    },
    phaseGroups: phaseGroups,
    numEntrants: numEntrants,
    state: event.state,
    slug: event.slug,
    name: event.name,
  };
}

const getGGEventData: T.GetFn = U.adaptBuilder(getGGEventDataImpl);
export default getGGEventData;
