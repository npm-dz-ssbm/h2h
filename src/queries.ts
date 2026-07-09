import * as $ from "@dz-ssbm/util";
import * as GQL from "@dz-ssbm/gql/node";
import * as T from "./T.js";
import { default as sets } from "./queries/setsData.gql.js";
import { default as tourneysSmall } from "./queries/tournamentDataSmall.gql.js";
import { default as tourneys } from "./queries/tournamentData.gql.js";

export const setsOp = GQL.Operation(
  sets,
  $.T.object({ page: $.T.number(), phaseGroupId: $.T.number() }),
  T.PhaseGroupSets,
);

export const tourneyOp = GQL.Operation(
  tourneys,
  $.T.object({ pageE: $.T.number(), pageS: $.T.number(), slug: $.T.string() }),
  T.TournamentEvent,
);

export const tourneyOpSmall = GQL.Operation(
  tourneysSmall,
  $.T.object({ pageE: $.T.number(), pageS: $.T.number(), slug: $.T.string() }),
  T.TournamentEvent,
);

export type SetsOp = typeof setsOp;
export type SetsOpData = $.T.infer<SetsOp["rt"]>;

export type TourneyOp = typeof tourneyOp;
export type TourneyOpData = $.T.infer<TourneyOp["rt"]>;
