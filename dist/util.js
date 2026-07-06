import * as $ from "@dz-ssbm/util";
import * as T from "./types.js";
export function* ggQueryAll(client, op, constVars, pvSpecs, opts = {}) {
    const pageVars = $.mapValues(pvSpecs, () => 0);
    function q() {
        return $.catching(() => client.operate(op, { ...constVars, ...pageVars }, opts), (e) => $.Err(T.H2HError.FetchError(e)));
    }
    const data = yield* q();
    const pageVarEntries = Object.entries(pvSpecs);
    pageVarEntries.sort(([k1], [k2]) => k1.localeCompare(k2));
    for (const [pageVar, getPageData] of pageVarEntries) {
        const getId = (e) => e.id;
        const total = getPageData(data).pageInfo.total;
        const ids = new Set(getPageData(data).nodes.map(getId));
        while (ids.size < total) {
            const currVarVal = pageVars[pageVar] || 0;
            pageVars[pageVar] = currVarVal + 1;
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
export function adaptBuilder(b) {
    return $.X(function (s, c, o = {}) {
        return this.reading({ slug: s, client: c, opts: o }, b);
    });
}
export function asNum(id) {
    if (!id) {
        return 0;
    }
    return typeof id === "string" ? parseInt(id) : id;
}
//# sourceMappingURL=util.js.map