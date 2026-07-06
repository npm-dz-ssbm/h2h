import * as $ from "@dz-ssbm/util";
import type * as GQL from "@dz-ssbm/gql";
import * as T from "./types.js";
export declare function ggQueryAll<Res extends GQL.ResType, CV extends GQL.VarsType, PV extends Record<string, (v: Res) => T.GGHasPageNodes>>(client: GQL.Client, op: GQL.Operation<CV & $.WithAllPropertiesAs<PV, number>, Res>, constVars: CV, pvSpecs: PV, opts?: GQL.Opts): T.H2HBuilder<Res>;
export declare function adaptBuilder(b: () => T.H2HBuilder<T.H2HEvent>): T.GetFn;
export declare function asNum(id: string | number | undefined): number;
//# sourceMappingURL=util.d.ts.map