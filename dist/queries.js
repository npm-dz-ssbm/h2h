import * as $ from "@dz-ssbm/util";
import * as GQL from "@dz-ssbm/gql";
import * as T from "./types.js";
import { default as sets } from "./queries/setsData.gql.js";
import { default as tourneysSmall } from "./queries/tournamentDataSmall.gql.js";
import { default as tourneys } from "./queries/tournamentData.gql.js";
export const setsOp = GQL.Operation(sets, $.T.object({ page: $.T.number(), phaseGroupId: $.T.number() }), T.PhaseGroupSets);
export const tourneyOp = GQL.Operation(tourneys, $.T.object({ pageE: $.T.number(), pageS: $.T.number(), slug: $.T.string() }), T.TournamentEvent);
export const tourneyOpSmall = GQL.Operation(tourneysSmall, $.T.object({ pageE: $.T.number(), pageS: $.T.number(), slug: $.T.string() }), T.TournamentEvent);
//# sourceMappingURL=queries.js.map