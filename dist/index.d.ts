import * as $ from "@dz-ssbm/util";
import * as GQL from "@dz-ssbm/gql";
import type * as T from "./types.js";
export declare function Client(clientOpts?: GQL.ClientOpts): GQL.Client;
export declare function getH2HData(source: T.H2HEventSource, client: GQL.Client, opts?: GQL.Opts): $.Xa<T.H2HEvent, T.H2HError>;
export declare function getRankings(sources: T.H2HEventSource[], client: GQL.Client, opts?: GQL.Opts): $.Xa<T.H2HRank[], T.H2HError>;
export declare const Source: {
    startgg: (slug: string) => T.H2HEventSource;
    challonge: (slug: string) => T.H2HEventSource;
};
export { H2HEntrant, H2HError, H2HEvent, H2HEventSource, H2HParticipant, H2HPhase, H2HPhaseGroup, H2HPlayer, H2HRank, H2HSet, H2HSlot, H2HStanding, H2HTournament, } from "./types.js";
export { ggQueryAll } from "./util.js";
//# sourceMappingURL=index.d.ts.map