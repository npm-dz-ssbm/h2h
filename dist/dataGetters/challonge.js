import puppeteer, { ElementHandle, Page } from "puppeteer";
import { fs, path } from "@dz-ssbm/sys";
import * as $ from "@dz-ssbm/util";
import * as GQL from "@dz-ssbm/gql";
import {} from "@dz-ssbm/gql/T";
import * as T from "../types.js";
import * as U from "../util.js";
function* getEventDataImpl() {
    const { slug, client, opts } = yield* $.xAsk();
    const fullOpts = Object.assign({}, client.baseOpts, opts);
    const cachePath = fullOpts.cachePath;
    const challongeId = `CHALLONGE-${slug}`;
    const slugCachePath = cachePath &&
        path.join(cachePath, `${challongeId}.json`);
    if (slugCachePath &&
        fullOpts.networkControl !== GQL.NetworkControl.forceFetch) {
        const cached = yield* $.xWait(() => fs.readTextFile(slugCachePath).then((s) => JSON.parse(s)), () => $.Ok(undefined));
        if (cached) {
            return yield* $.xTry(() => $.xPure(T.H2HEvent.parse(cached)), (e) => $.Err(T.H2HError.ParseCached(e)));
        }
    }
    if (fullOpts.networkControl === GQL.NetworkControl.cacheOnly) {
        return yield* $.xFail(T.H2HError.FetchError(GQL.Error.CacheOnlyEmpty));
    }
    function astralOp(sel, op, m) {
        return $.xWait(m, () => $.Err(T.H2HError.AstralError({ sel, op })));
    }
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
    const browser = yield* astralOp("", "launch", () => puppeteer.launch({ args: [`--user-agent=${userAgent}`] }));
    const pageUrl = `https://challonge.com/${slug}`;
    yield* $.xLog("opening Page...");
    const page = yield* astralOp("", "newPage", () => browser.newPage());
    yield* $.xWait(() => page.setViewport({ width: 1920, height: 1080 }));
    yield* $.xLog("navigating...");
    yield* astralOp("", "load", () => page.goto(pageUrl, { waitUntil: "domcontentloaded" }));
    function* waitForSelector(sel) {
        yield* astralOp(sel, "waitForSelector", () => page.waitForSelector(sel, { timeout: 120000 }));
    }
    function* $$(sel, el = page) {
        return yield* astralOp(sel, "$$", () => el.$$(sel));
    }
    function* $1(sel, el = page) {
        return yield* astralOp(sel, "$", () => el.$(sel).then((e) => e));
    }
    function* innerText(sel, el = page) {
        return yield* astralOp(sel, "innerText", () => el
            .$(sel)
            .then((l) => l.getProperty("innerText"))
            .then((prop) => prop.jsonValue()));
    }
    function* innerHtml(arg1, arg2) {
        const sel = typeof arg1 === "string" ? arg1 : "";
        const selHandle = typeof arg1 !== "string"
            ? Promise.resolve(arg1)
            : (arg2 || page).$(sel);
        return yield* astralOp(sel, "innerHtml", () => selHandle
            .then((l) => l.getProperty("innerHTML"))
            .then((prop) => prop.jsonValue())
            .then((s) => {
            if (typeof s === "string") {
                return s;
            }
            throw `Non-string: [ ${s} ]`;
        }));
    }
    function* getAttribute(attribute, el) {
        return yield* astralOp(attribute, "getAttribute", () => el
            .evaluate((e, at) => e.getAttribute(at), attribute)
            .then((l) => l));
    }
    yield* $.xLog("wait for sel :: config");
    yield* waitForSelector(".redesigned-meta-list .item .text");
    yield* $.xLog("wait for sel :: title");
    yield* waitForSelector(".title #title");
    yield* $.xLog("wait for sel :: match-player");
    yield* waitForSelector(".bracket-svg .match .match--player");
    yield* $.xLog("extract data");
    let isDE = false;
    let nameRes = $.Err(T.H2HError.MissingData("event.name"));
    let dateRes = $.Err(T.H2HError.MissingData("event.date"));
    const itemEls = yield* $$(".redesigned-meta-list .item");
    for (const el of itemEls) {
        const itemLabel = yield* innerText(".item-label", el);
        const itemText = yield* innerText(".text", el);
        if (itemLabel === "Start Time" || itemLabel === "Start") {
            const [mStr = "", dStr = "", yStr = ""] = itemText.split(" ");
            const month = {
                January: 0,
                February: 1,
                March: 2,
                April: 3,
                May: 4,
                June: 5,
                July: 6,
                August: 7,
                September: 8,
                October: 9,
                November: 10,
                December: 11,
            }[mStr] || 0;
            const day = parseInt(dStr.split(",")[0] || "");
            const year = parseInt(yStr);
            const date = Math.floor(new Date(year, month, day, 12).valueOf() / 1000);
            dateRes = $.Ok(date);
        }
        if (itemLabel === "Game") {
            nameRes = $.Ok(itemText);
        }
        if (itemLabel === "Format") {
            isDE = itemText === "Double Elimination";
        }
    }
    const name = yield* $.xOk(nameRes);
    const date = yield* $.xOk(dateRes);
    console.log({ name, date });
    const tournamentName = yield* innerText(".title #title");
    const bracketEls = yield* $$(".bracket-svg");
    const entrants = {};
    const baseSets = {};
    for (const bracketEl of bracketEls) {
        const matchEls = yield* $$(".match", bracketEl);
        for (const matchEl of matchEls) {
            const setId = yield* getAttribute("data-match-id", matchEl);
            const set = {
                id: setId,
                slots: [],
                winnerId: null,
            };
            baseSets[setId] = set;
            const playerEls = yield* $$(".match--player", matchEl);
            for (const playerEl of playerEls) {
                const entrantId = yield* getAttribute("data-participant-id", playerEl);
                const playerName = yield* innerHtml("title", playerEl);
                const playerId = `CH-${playerName}`;
                const playerBase = {
                    gamerTag: playerName,
                    name: playerName,
                    id: playerId,
                    prefix: null,
                };
                entrants[entrantId] ||= {
                    id: entrantId,
                    player: { ...playerBase },
                    participants: [{ ...playerBase, player: { ...playerBase } }],
                    standing: { placement: 0, isFinal: false },
                };
                const scoreEl = yield* $1(".match--player-score", playerEl);
                const scoreClass = yield* getAttribute("class", scoreEl);
                scoreClass.split(" ").forEach((classPart) => {
                    set.winnerId ||= classPart !== "-winner" ? undefined : entrantId;
                });
                const score = yield* $.xTry(function* () {
                    const scoreS = yield* innerHtml(scoreEl);
                    const scoreN = parseInt(scoreS);
                    return Number.isNaN(scoreN) ? undefined : scoreN;
                }, () => $.Ok(undefined));
                const slot = { entrant: { id: entrantId }, score };
                set.slots ||= [];
                set.slots.push(slot);
            }
        }
    }
    const baseSetList = Object.values(baseSets);
    baseSetList.sort((s1, s2) => U.asNum(s2.id) - U.asNum(s1.id));
    let lastSet = null;
    let wasGrands = false;
    let isLosers = false;
    const slotEntrantId = (slot) => slot?.entrant?.id || "";
    function slotsKey(set) {
        if (!set) {
            return "";
        }
        const slots = set.slots || [];
        const entrantIds = slots.map(slotEntrantId);
        entrantIds.sort();
        return entrantIds.join("|");
    }
    const isComplete = (() => {
        for (const { winnerId } of baseSetList) {
            if (!winnerId) {
                return false;
            }
        }
        return true;
    })();
    const gfEntrants = new Set();
    const nonGfEntrants = new Set();
    let depth = 0;
    let roundInd = 0;
    let isDropRound = true;
    const sets = $.mapValues(baseSets, (baseSet) => {
        const isGrands = Boolean((!lastSet && isDE) ||
            (wasGrands && slotsKey(baseSet) === slotsKey(lastSet)));
        if (lastSet && isGrands && wasGrands) {
            lastSet.isLosers = true;
        }
        const slots = baseSet.slots || [];
        slots.forEach((slot) => (isGrands ? gfEntrants : nonGfEntrants).add(slotEntrantId(slot)));
        let seenAllGFEntrants = true;
        gfEntrants.forEach((e) => (seenAllGFEntrants &&= nonGfEntrants.has(e)));
        isLosers ||= !isGrands && wasGrands;
        const wasLosers = isLosers;
        isLosers &&= !seenAllGFEntrants;
        if ((!isLosers && wasLosers) || (!isGrands && wasGrands)) {
            depth = roundInd = 0;
        }
        const slotName = (slot) => entrants[slotEntrantId(slot)]?.participants[0]?.name;
        const slotScore = (slot) => slot.score === undefined ? "" : `${slotName(slot)} ${slot.score}`;
        slots.forEach((slot) => (slot.displayScore = slot.score === undefined
            ? undefined
            : `${slot.score}`));
        slots.forEach((slot) => (slot.playerId = entrants[slotEntrantId(slot)]?.player.id));
        const fullSet = {
            ...baseSet,
            displayScore: slots.map(slotScore).join(" - "),
            isGrands: isGrands,
            depth: depth,
            isLosers: isLosers,
            isDropRound: isDropRound,
            round: roundInd,
            doesCount: isComplete,
            isBye: false,
            isDQ: false,
        };
        const [slot1, slot2] = fullSet.slots || [undefined, undefined];
        const is1w = fullSet.winnerId === slotEntrantId(slot1);
        const wId = slotEntrantId(is1w ? slot1 : slot2);
        const lId = slotEntrantId(is1w ? slot2 : slot1);
        if (isComplete) {
            if (isGrands && !wasGrands) {
                entrants[wId] &&
                    (entrants[wId].standing = { placement: 1, isFinal: true });
                entrants[lId] &&
                    (entrants[lId].standing = { placement: 2, isFinal: true });
            }
            else if (isLosers) {
                const p2Inc = Math.pow(2, depth + 1);
                entrants[lId] &&
                    (entrants[lId].standing = {
                        placement: 1 + (isDropRound ? p2Inc : Math.floor((3 * p2Inc) / 2)),
                        isFinal: true,
                    });
            }
            else if (!isDE) {
                if (!depth) {
                    entrants[wId] &&
                        (entrants[wId].standing = { placement: 1, isFinal: true });
                }
                entrants[lId] &&
                    (entrants[lId].standing = {
                        placement: Math.pow(2, depth) + 1,
                        isFinal: true,
                    });
            }
        }
        roundInd++;
        if (Math.pow(2, depth) === roundInd) {
            roundInd = 0;
            if (isDropRound && isLosers) {
                isDropRound = false;
            }
            else {
                isDropRound = true;
                depth++;
            }
        }
        wasGrands = isGrands;
        lastSet = fullSet;
        return fullSet;
    });
    function roundNum(set) {
        if (set.isGrands) {
            return 0;
        }
        if (set.isLosers) {
            return 2 * set.depth + (set.isDropRound ? 0 : 1);
        }
        return set.depth;
    }
    let maxRoundNumW = 0;
    let maxRoundNumL = 0;
    for (const set of Object.values(sets)) {
        if (set.isLosers) {
            maxRoundNumL = Math.max(maxRoundNumL, roundNum(set));
        }
        else {
            maxRoundNumW = Math.max(maxRoundNumW, roundNum(set));
        }
    }
    function roundLabel(set) {
        if (set.isGrands) {
            return set.isLosers ? "Finals (reset)" : "Finals";
        }
        if (set.isLosers) {
            return `Losers Round ${maxRoundNumL - roundNum(set) + 1}`;
        }
        if (set.depth === 0) {
            return isDE ? "Semifinals" : "Finals";
        }
        if (!isDE && set.depth === 1) {
            return "Semifinals";
        }
        return `Round ${maxRoundNumW - roundNum(set) + 1}`;
    }
    for (const set of Object.values(sets)) {
        set.fullRoundText = roundLabel(set);
    }
    const numEntrants = Object.values(entrants).length;
    for (const entrant of Object.values(entrants)) {
        entrant.standing.placement ||= numEntrants;
    }
    const imageUrl = "https://i.imgur.com/7MsdKge.jpeg";
    return {
        imageUrl: imageUrl,
        state: isComplete ? "COMPLETED" : "ACTIVE",
        slug: slug,
        id: challongeId,
        numEntrants: numEntrants,
        tournamentName: tournamentName,
        bracketingSite: "challonge",
        entrants: entrants,
        name: name,
        date: date,
        tournament: {
            id: slug,
            name: tournamentName,
            endAt: date,
            images: [{ type: "profile", url: imageUrl }],
        },
        phaseGroups: [
            {
                id: 1,
                phase: { id: 1, name: "Bracket", phaseOrder: 1 },
                displayIdentifier: "1",
                sets,
            },
        ],
    };
}
const getEventData = function* (...args) {
    const res = yield* U.adaptBuilder(getEventDataImpl)(...args);
    const fullOpts = { ...args[1].baseOpts, ...(args[2] || {}) };
    const cachePath = fullOpts.cachePath;
    if (cachePath && res.state === "COMPLETED") {
        const cacheFilePath = path.join(cachePath, `${res.id}.json`);
        yield* $.xWait(() => fs.writeFilep(cacheFilePath, JSON.stringify(res)), (e) => $.Err(T.H2HError.FetchError(GQL.Error.CacheWriteError(e))));
    }
    return res;
};
export default getEventData;
//# sourceMappingURL=challonge.js.map