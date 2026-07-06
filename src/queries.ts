import { fileURLToPath } from "node:url";
import { fs, path } from "@dz-ssbm/sys";
import * as $ from "@dz-ssbm/util";
import * as GQL from "@dz-ssbm/gql";
import * as T from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sets: string = await fs.readTextFile(
  path.join(__dirname, "queries", "setsData.gql"),
);
const tourneysSmall: string = await fs.readTextFile(
  path.join(__dirname, "queries", "tournamentDataSmall.gql"),
);
const tourneys: string = await fs.readTextFile(
  path.join(__dirname, "queries", "tournamentData.gql"),
);

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
