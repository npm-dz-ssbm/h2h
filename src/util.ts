import * as $ from "@dz-ssbm/util";
import type * as GQL from "@dz-ssbm/gql/node";
import * as T from "./T.js";

export type H2HBuilder<Res = void> = $.Xa<
  Res,
  T.H2HError,
  { r: { client: GQL.Client; opts: GQL.Opts; slug: string } }
>;

export type GetFn = (
  slug: string,
  client: GQL.Client,
  opts?: GQL.Opts,
) => $.Xa<T.H2HEvent, T.H2HError>;

export function* ggQueryAll<
  Res extends GQL.ResType,
  CV extends GQL.VarsType,
  PV extends Record<string, (v: Res) => T.GGHasPageNodes>,
>(
  client: GQL.Client,
  op: GQL.Operation<CV & $.WithAllPropertiesAs<PV, number>, Res>,
  constVars: CV,
  pvSpecs: PV,
  opts: GQL.Opts = {},
): H2HBuilder<Res> {
  const pageVars: $.WithAllPropertiesAs<PV, number> = $.mapValues(
    pvSpecs,
    () => 0,
  );
  function q() {
    return $.xCatch(
      client.operate(op, { ...constVars, ...pageVars }, opts),
      (e) => $.Err(T.H2HError.FetchError(e)),
    );
  }
  const data = yield* q();
  const pageVarEntries = Object.entries(pvSpecs);
  pageVarEntries.sort(([k1], [k2]) => k1.localeCompare(k2));
  for (const [pageVar, getPageData] of pageVarEntries) {
    const getId = (e: { id: number }) => e.id;
    const total = getPageData(data).pageInfo.total;
    const ids = new Set(getPageData(data).nodes.map(getId));
    while (ids.size < total) {
      const currVarVal = (pageVars as Record<string, number>)[pageVar] || 0;
      (pageVars as Record<string, number>)[pageVar] = currVarVal + 1;
      const next = yield* q();
      const preSize = ids.size;
      for (const el of getPageData(next).nodes) {
        const id = getId(el);
        if (!ids.has(id)) {
          getPageData(data).nodes.push(el);
        }
        ids.add(id);
      }
      if (preSize === ids.size && currVarVal > 0) {
        const cvs = JSON.stringify(constVars);
        const pvs = JSON.stringify(pageVars);
        throw `nodes unchanged ${op.query} ${cvs} ${pageVar} ${pvs}`;
      }
    }
  }
  return data;
}

export const adaptBuilder: (b: () => H2HBuilder<T.H2HEvent>) => GetFn =
  (b) =>
  (s, c, o = {}) =>
    $.xReading({ slug: s, client: c, opts: o }, b());

export function asNum(id: string | number | undefined): number {
  if (!id) {
    return 0;
  }
  return typeof id === "string" ? parseInt(id) : id;
}
