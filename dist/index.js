import { WholeHistoryRating } from "whr";
import * as $ from "@dz-ssbm/util";
import * as GQL from "@dz-ssbm/gql";
import * as U from "./util.js";
import { default as getGGEventData } from "./dataGetters/gg.js";
import { default as getChallongeEventData } from "./dataGetters/challonge.js";
export function Client(clientOpts = {}) {
    return GQL.Client("https://api.start.gg/gql/alpha", clientOpts);
}
export function getH2HData(source, client, opts = {}) {
    const getter = source.bracketingSite === "challonge"
        ? getChallongeEventData
        : getGGEventData;
    return getter(source.slug, client, opts);
}
export function* getRankings(sources, client, opts = {}) {
    const events = yield* $.xMap(sources, (s) => getH2HData(s, client, opts));
    events.sort((e1, e2) => e1.date - e2.date);
    const setGroups = [];
    const ranksByPlayerId = {};
    for (const event of events) {
        for (const entrant of Object.values(event.entrants)) {
            const player = entrant.participants[0]?.player;
            if (!player) {
                continue;
            }
            ranksByPlayerId[player.id] ||= {
                player,
                events: 0,
                wins: 0,
                losses: 0,
            };
            ranksByPlayerId[player.id].events++;
        }
        const setGroup = [];
        setGroups.push(setGroup);
        for (const phaseGroup of event.phaseGroups) {
            const sets = Object.values(phaseGroup.sets);
            sets.sort((s1, s2) => U.asNum(s1.id) - U.asNum(s2.id));
            for (const set of sets) {
                setGroup.push(set);
            }
        }
    }
    const whr = new WholeHistoryRating({ w2: 20 });
    const whrKey = (playerId) => `player::[ ${playerId} ]`;
    for (const [setGroup, groupNum] of $.withInd(setGroups)) {
        for (const set of setGroup) {
            if (!set.doesCount) {
                continue;
            }
            const [wPId, lPId] = set.winnerId === set.slots[0]?.entrant?.id
                ? [set.slots[0]?.playerId, set.slots[1]?.playerId]
                : [set.slots[1]?.playerId, set.slots[0]?.playerId];
            if (!set.doesCount || !wPId || !lPId) {
                continue;
            }
            const wkey = whrKey(wPId);
            const lkey = whrKey(lPId);
            ranksByPlayerId[wPId] && ranksByPlayerId[wPId].wins++;
            ranksByPlayerId[lPId] && ranksByPlayerId[lPId].losses++;
            whr.createGame(wkey, lkey, "B", groupNum, 0);
        }
    }
    whr.iterate(100);
    const ranks = Object.values(ranksByPlayerId);
    for (const rank of ranks) {
        const ratings = whr.ratingsForPlayer(whrKey(rank.player.id));
        const lastRating = ratings[ratings.length - 1];
        const rawRating = lastRating && lastRating[1];
        if ($.isNil(rawRating)) {
            continue;
        }
        rank.rating = rawRating + 1000;
    }
    ranks.sort((p1, p2) => (p2.rating || 0) - (p1.rating || 0));
    return [
        ...ranks.filter((p) => $.isAny(p.rating)),
        ...ranks.filter((p) => $.isNil(p.rating)),
    ];
}
export const Source = {
    startgg: (slug) => ({ slug, bracketingSite: "startgg" }),
    challonge: (slug) => ({ slug, bracketingSite: "challonge" }),
};
export { H2HEntrant, H2HError, H2HEvent, H2HEventSource, H2HParticipant, H2HPhase, H2HPhaseGroup, H2HPlayer, H2HRank, H2HSet, H2HSlot, H2HStanding, H2HTournament, } from "./types.js";
export { ggQueryAll } from "./util.js";
//# sourceMappingURL=index.js.map