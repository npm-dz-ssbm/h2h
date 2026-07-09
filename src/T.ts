import * as $ from "@dz-ssbm/util";
import * as GQL from "@dz-ssbm/gql";

export const H2HError = $.T.defVariant("@dz-ssbm/h2h|H2HError", {
  FetchError: GQL.Error.zodType,
  AstralError: $.T.object({ sel: $.T.string(), op: $.T.string() }),
  MissingData: $.T.string(),
  EventBuildError: $.T.unknown(),
  ParseCached: $.T.unknown(),
});
export type H2HError = $.T.inferDefined<typeof H2HError>;

const EntrantStub = $.T.object({
  id: $.T.number(),
});
const ImagesStub = $.T.array(
  $.T.object({
    url: $.T.string(),
    type: $.T.string(),
  }),
);
export const IdType = $.T.union([$.T.number(), $.T.string()]);
function GGPageNodes<D extends Record<string, $.T.ZodType>>(d: D) {
  return $.T.object({
    pageInfo: $.T.object({
      total: $.T.number(),
    }),
    nodes: $.T.array(
      $.T.object({
        id: $.T.number(),
        ...d,
      }),
    ),
  });
}

export const TournamentEvent = $.T.object({
  event: $.T.object({
    id: IdType,
    numEntrants: $.T.number(),
    name: $.T.string(),
    slug: $.T.string(),
    state: $.T.string(),
    tournament: $.T.object({
      id: IdType,
      name: $.T.string(),
      endAt: $.T.number(),
      images: ImagesStub,
    }),
    entrants: GGPageNodes({
      initialSeedNum: $.T.number(),
      participants: $.T.array(
        $.T.object({
          gamerTag: $.T.string(),
          prefix: $.T.string().nullish(),
          player: $.T.object({
            id: $.T.number(),
            gamerTag: $.T.string(),
            prefix: $.T.string().nullish(),
            user: $.T.object({
              genderPronoun: $.T.string().nullish(),
              name: $.T.string().nullish(),
              authorizations: $.T.array(
                $.T.object({
                  externalUsername: $.T.string(),
                  type: $.T.string(),
                }),
              ).nullish(),
              images: ImagesStub,
            }).nullish(),
          }),
        }),
      ),
    }),
    standings: GGPageNodes({
      id: $.T.number(),
      placement: $.T.number(),
      isFinal: $.T.boolean(),
      entrant: EntrantStub,
    }),
    phaseGroups: $.T.array(
      $.T.object({
        id: $.T.number(),
        phase: $.T.object({
          id: $.T.number(),
          name: $.T.string(),
          phaseOrder: $.T.number(),
        }),
        displayIdentifier: $.T.string(),
      }),
    ),
  }),
});

export const PhaseGroupSets = $.T.object({
  phaseGroup: $.T.object({
    id: $.T.number(),
    bracketType: $.T.string(),
    sets: $.T.object({
      pageInfo: $.T.object({
        total: $.T.number(),
      }),
      nodes: $.T.array(
        $.T.object({
          id: $.T.number(),
          fullRoundText: $.T.string(),
          round: $.T.number(),
          wPlacement: $.T.number(),
          lPlacement: $.T.number(),
          games: $.T.array(
            $.T.object({
              winnerId: $.T.number().nullish(),
              orderNum: $.T.number(),
              entrant1Score: $.T.number(),
              entrant2Score: $.T.number(),
              selections: $.T.array(
                $.T.object({
                  id: $.T.number(),
                  character: $.T.object({
                    id: $.T.number(),
                    name: $.T.string(),
                  }),
                  entrant: EntrantStub,
                  orderNum: $.T.number(),
                  selectionValue: $.T.string(),
                }),
              ),
            }),
          ).nullish(),
          displayScore: $.T.string(),
          identifier: $.T.string(),
          winnerId: $.T.number(),
          slots: $.T.array(
            $.T.object({
              entrant: EntrantStub,
            }),
          ),
          state: $.T.number(),
        }),
      ),
    }),
  }),
});
export type PhaseGroupSets = $.T.infer<typeof PhaseGroupSets>;
export type TournamentEvent = $.T.infer<typeof TournamentEvent>;

export const H2HPlayer = $.T.object({
  id: IdType,
  gamerTag: $.T.string(),
  name: $.T.string(),
  prefix: $.T.string().nullish(),
  pronouns: $.T.string().nullish(),
});
export type H2HPlayer = $.T.infer<typeof H2HPlayer>;

export const H2HRank = $.T.object({
  player: H2HPlayer,
  wins: $.T.number(),
  losses: $.T.number(),
  events: $.T.number(),
  rating: $.T.number().nullish(),
});
export type H2HRank = $.T.infer<typeof H2HRank>;

export const H2HParticipant = $.T.object({
  id: IdType,
  gamerTag: $.T.string(),
  name: $.T.string(),
  prefix: $.T.string().nullish(),
  player: H2HPlayer,
});
export type H2HParticipant = $.T.infer<typeof H2HParticipant>;

export const H2HStanding = $.T.object({
  placement: $.T.number(),
  isFinal: $.T.boolean(),
});
export type H2HStanding = $.T.infer<typeof H2HStanding>;

export const H2HEntrant = $.T.object({
  id: IdType,
  player: H2HPlayer,
  participants: $.T.array(H2HParticipant),
  standing: H2HStanding,
});
export type H2HEntrant = $.T.infer<typeof H2HEntrant>;

export const H2HPhase = $.T.object({
  id: IdType,
  name: $.T.string(),
  phaseOrder: $.T.number(),
});
export type H2HPhase = $.T.infer<typeof H2HPhase>;

export const H2HSlot = $.T.object({
  entrant: $.T.object({ id: IdType }).nullish(),
  score: $.T.nullish($.T.number()),
  displayScore: $.T.nullish($.T.string()),
  playerId: $.T.nullish(IdType),
});
export type H2HSlot = $.T.infer<typeof H2HSlot>;

export const H2HSet = $.T.object({
  id: IdType,
  displayScore: $.T.string(),
  fullRoundText: $.T.string().nullish(),
  round: $.T.number(),
  depth: $.T.number(),
  isLosers: $.T.boolean(),
  isDropRound: $.T.boolean(),
  isGrands: $.T.boolean(),
  isBye: $.T.boolean(),
  isDQ: $.T.boolean(),
  doesCount: $.T.boolean(),
  winnerId: $.T.nullish(IdType),
  slots: $.T.array(H2HSlot),
});
export type H2HSet = $.T.infer<typeof H2HSet>;

export const H2HPhaseGroup = $.T.object({
  id: IdType,
  phase: H2HPhase,
  displayIdentifier: $.T.string(),
  sets: $.T.record(IdType, H2HSet),
});
export type H2HPhaseGroup = $.T.infer<typeof H2HPhaseGroup>;

export const H2HTournament = $.T.object({
  id: IdType,
  name: $.T.string(),
  endAt: $.T.number(),
  images: ImagesStub,
});
export type H2HTournament = $.T.infer<typeof H2HTournament>;

export const H2HEvent = $.T.object({
  id: IdType,
  bracketingSite: $.T.literal(["startgg", "challonge"]),
  tournamentName: $.T.string(),
  name: $.T.string(),
  slug: $.T.string(),
  state: $.T.string(),
  date: $.T.number(),
  imageUrl: $.T.string().nullish(),
  entrants: $.T.record(IdType, H2HEntrant),
  phaseGroups: $.T.array(H2HPhaseGroup),
  numEntrants: $.T.number(),
  tournament: H2HTournament,
});
export type H2HEvent = $.T.infer<typeof H2HEvent>;

export type GGHasPageNodes = {
  pageInfo: { total: number };
  nodes: { id: number }[];
};

export const H2HEventSource = $.T.object({
  bracketingSite: $.T.literal(["startgg", "challonge"]),
  slug: $.T.string(),
});
export type H2HEventSource = $.T.infer<typeof H2HEventSource>;
