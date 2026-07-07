import * as $ from "@dz-ssbm/util";
import * as GQL from "@dz-ssbm/gql/T";
export declare const H2HError: $.T.VariantDef<"@dz-ssbm/h2h|H2HError", {
    FetchError: $.T.zodType<GQL.Error>;
    AstralError: $.T.ZodObject<{
        sel: $.T.ZodString;
        op: $.T.ZodString;
    }>;
    MissingData: $.T.ZodString;
    EventBuildError: $.T.ZodUnknown;
    ParseCached: $.T.ZodUnknown;
}>;
export type H2HError = $.T.inferDefined<typeof H2HError>;
declare const ImagesStub: $.T.ZodArray<$.T.ZodObject<{
    url: $.T.ZodString;
    type: $.T.ZodString;
}>>;
export type ZodIdType = $.T.ZodUnion<[$.T.ZodNumber, $.T.ZodString]>;
export declare const IdType: ZodIdType;
export declare const TournamentEvent: $.T.ZodObject<{
    event: $.T.ZodObject<{
        id: ZodIdType;
        numEntrants: $.T.ZodNumber;
        name: $.T.ZodString;
        slug: $.T.ZodString;
        state: $.T.ZodString;
        tournament: $.T.ZodObject<{
            id: ZodIdType;
            name: $.T.ZodString;
            endAt: $.T.ZodNumber;
            images: $.T.ZodArray<$.T.ZodObject<{
                url: $.T.ZodString;
                type: $.T.ZodString;
            }, $.T.z.core.$strip>>;
        }, $.T.z.core.$strip>;
        entrants: $.T.ZodObject<{
            pageInfo: $.T.ZodObject<{
                total: $.T.ZodNumber;
            }, $.T.z.core.$strip>;
            nodes: $.T.ZodArray<$.T.ZodObject<{
                id: $.T.ZodNumber;
                initialSeedNum: $.T.ZodNumber;
                participants: $.T.ZodArray<$.T.ZodObject<{
                    gamerTag: $.T.ZodString;
                    prefix: $.T.ZodOptional<$.T.ZodNullable<$.T.ZodString>>;
                    player: $.T.ZodObject<{
                        id: $.T.ZodNumber;
                        gamerTag: $.T.ZodString;
                        prefix: $.T.ZodOptional<$.T.ZodNullable<$.T.ZodString>>;
                        user: $.T.ZodOptional<$.T.ZodNullable<$.T.ZodObject<{
                            genderPronoun: $.T.ZodOptional<$.T.ZodNullable<$.T.ZodString>>;
                            name: $.T.ZodOptional<$.T.ZodNullable<$.T.ZodString>>;
                            authorizations: $.T.ZodOptional<$.T.ZodNullable<$.T.ZodArray<$.T.ZodObject<{
                                externalUsername: $.T.ZodString;
                                type: $.T.ZodString;
                            }, $.T.z.core.$strip>>>>;
                            images: $.T.ZodArray<$.T.ZodObject<{
                                url: $.T.ZodString;
                                type: $.T.ZodString;
                            }, $.T.z.core.$strip>>;
                        }, $.T.z.core.$strip>>>;
                    }, $.T.z.core.$strip>;
                }, $.T.z.core.$strip>>;
            }, $.T.z.core.$strip>>;
        }, $.T.z.core.$strip>;
        standings: $.T.ZodObject<{
            pageInfo: $.T.ZodObject<{
                total: $.T.ZodNumber;
            }, $.T.z.core.$strip>;
            nodes: $.T.ZodArray<$.T.ZodObject<{
                id: $.T.ZodNumber;
                placement: $.T.ZodNumber;
                isFinal: $.T.ZodBoolean;
                entrant: $.T.ZodObject<{
                    id: $.T.ZodNumber;
                }, $.T.z.core.$strip>;
            }, $.T.z.core.$strip>>;
        }, $.T.z.core.$strip>;
        phaseGroups: $.T.ZodArray<$.T.ZodObject<{
            id: $.T.ZodNumber;
            phase: $.T.ZodObject<{
                id: $.T.ZodNumber;
                name: $.T.ZodString;
                phaseOrder: $.T.ZodNumber;
            }, $.T.z.core.$strip>;
            displayIdentifier: $.T.ZodString;
        }, $.T.z.core.$strip>>;
    }, $.T.z.core.$strip>;
}, $.T.z.core.$strip>;
export declare const PhaseGroupSets: $.T.ZodObject<{
    phaseGroup: $.T.ZodObject<{
        id: $.T.ZodNumber;
        bracketType: $.T.ZodString;
        sets: $.T.ZodObject<{
            pageInfo: $.T.ZodObject<{
                total: $.T.ZodNumber;
            }, $.T.z.core.$strip>;
            nodes: $.T.ZodArray<$.T.ZodObject<{
                id: $.T.ZodNumber;
                fullRoundText: $.T.ZodString;
                round: $.T.ZodNumber;
                wPlacement: $.T.ZodNumber;
                lPlacement: $.T.ZodNumber;
                games: $.T.ZodOptional<$.T.ZodNullable<$.T.ZodArray<$.T.ZodObject<{
                    winnerId: $.T.ZodOptional<$.T.ZodNullable<$.T.ZodNumber>>;
                    orderNum: $.T.ZodNumber;
                    entrant1Score: $.T.ZodNumber;
                    entrant2Score: $.T.ZodNumber;
                    selections: $.T.ZodArray<$.T.ZodObject<{
                        id: $.T.ZodNumber;
                        character: $.T.ZodObject<{
                            id: $.T.ZodNumber;
                            name: $.T.ZodString;
                        }, $.T.z.core.$strip>;
                        entrant: $.T.ZodObject<{
                            id: $.T.ZodNumber;
                        }, $.T.z.core.$strip>;
                        orderNum: $.T.ZodNumber;
                        selectionValue: $.T.ZodString;
                    }, $.T.z.core.$strip>>;
                }, $.T.z.core.$strip>>>>;
                displayScore: $.T.ZodString;
                identifier: $.T.ZodString;
                winnerId: $.T.ZodNumber;
                slots: $.T.ZodArray<$.T.ZodObject<{
                    entrant: $.T.ZodObject<{
                        id: $.T.ZodNumber;
                    }, $.T.z.core.$strip>;
                }, $.T.z.core.$strip>>;
                state: $.T.ZodNumber;
            }, $.T.z.core.$strip>>;
        }, $.T.z.core.$strip>;
    }, $.T.z.core.$strip>;
}, $.T.z.core.$strip>;
export type PhaseGroupSets = $.T.infer<typeof PhaseGroupSets>;
export type TournamentEvent = $.T.infer<typeof TournamentEvent>;
type ZodNullish<T extends $.T.ZodType> = $.T.ZodOptional<$.T.ZodNullable<T>>;
export declare const H2HPlayer: $.T.ZodObject<{
    id: ZodIdType;
    gamerTag: $.T.ZodString;
    name: $.T.ZodString;
    prefix: ZodNullish<$.T.ZodString>;
    pronouns: ZodNullish<$.T.ZodString>;
}>;
export type H2HPlayer = $.T.infer<typeof H2HPlayer>;
export declare const H2HRank: $.T.ZodObject<{
    player: typeof H2HPlayer;
    wins: $.T.ZodNumber;
    losses: $.T.ZodNumber;
    events: $.T.ZodNumber;
    rating: ZodNullish<$.T.ZodNumber>;
}>;
export type H2HRank = $.T.infer<typeof H2HRank>;
export declare const H2HParticipant: $.T.ZodObject<{
    id: ZodIdType;
    gamerTag: $.T.ZodString;
    name: $.T.ZodString;
    prefix: ZodNullish<$.T.ZodString>;
    player: typeof H2HPlayer;
}>;
export type H2HParticipant = $.T.infer<typeof H2HParticipant>;
export declare const H2HStanding: $.T.ZodObject<{
    placement: $.T.ZodNumber;
    isFinal: $.T.ZodBoolean;
}>;
export type H2HStanding = $.T.infer<typeof H2HStanding>;
export declare const H2HEntrant: $.T.ZodObject<{
    id: ZodIdType;
    player: typeof H2HPlayer;
    participants: $.T.ZodArray<typeof H2HParticipant>;
    standing: typeof H2HStanding;
}>;
export type H2HEntrant = $.T.infer<typeof H2HEntrant>;
export declare const H2HPhase: $.T.ZodObject<{
    id: ZodIdType;
    name: $.T.ZodString;
    phaseOrder: $.T.ZodNumber;
}>;
export type H2HPhase = $.T.infer<typeof H2HPhase>;
export declare const H2HSlot: $.T.ZodObject<{
    entrant: ZodNullish<$.T.ZodObject<{
        id: ZodIdType;
    }>>;
    score: ZodNullish<$.T.ZodNumber>;
    displayScore: ZodNullish<$.T.ZodString>;
    playerId: ZodNullish<ZodIdType>;
}>;
export type H2HSlot = $.T.infer<typeof H2HSlot>;
export declare const H2HSet: $.T.ZodObject<{
    id: ZodIdType;
    displayScore: $.T.ZodString;
    fullRoundText: ZodNullish<$.T.ZodString>;
    round: $.T.ZodNumber;
    depth: $.T.ZodNumber;
    isLosers: $.T.ZodBoolean;
    isDropRound: $.T.ZodBoolean;
    isGrands: $.T.ZodBoolean;
    isBye: $.T.ZodBoolean;
    isDQ: $.T.ZodBoolean;
    doesCount: $.T.ZodBoolean;
    winnerId: ZodNullish<ZodIdType>;
    slots: $.T.ZodArray<typeof H2HSlot>;
}>;
export type H2HSet = $.T.infer<typeof H2HSet>;
export declare const H2HPhaseGroup: $.T.ZodObject<{
    id: ZodIdType;
    phase: typeof H2HPhase;
    displayIdentifier: $.T.ZodString;
    sets: $.T.ZodRecord<ZodIdType, typeof H2HSet>;
}>;
export type H2HPhaseGroup = $.T.infer<typeof H2HPhaseGroup>;
export declare const H2HTournament: $.T.ZodObject<{
    id: ZodIdType;
    name: $.T.ZodString;
    endAt: $.T.ZodNumber;
    images: typeof ImagesStub;
}>;
export type H2HTournament = $.T.infer<typeof H2HTournament>;
export declare const H2HEvent: $.T.ZodObject<{
    id: ZodIdType;
    bracketingSite: $.T.ZodLiteral<"startgg" | "challonge">;
    tournamentName: $.T.ZodString;
    name: $.T.ZodString;
    slug: $.T.ZodString;
    state: $.T.ZodString;
    date: $.T.ZodNumber;
    imageUrl: ZodNullish<$.T.ZodString>;
    entrants: $.T.ZodRecord<ZodIdType, typeof H2HEntrant>;
    phaseGroups: $.T.ZodArray<typeof H2HPhaseGroup>;
    numEntrants: $.T.ZodNumber;
    tournament: typeof H2HTournament;
}>;
export type H2HEvent = $.T.infer<typeof H2HEvent>;
export type GGHasPageNodes = {
    pageInfo: {
        total: number;
    };
    nodes: {
        id: number;
    }[];
};
export type H2HBuilder<Res = void> = $.Xa<Res, H2HError, {
    reads: {
        client: GQL.Client;
        opts: GQL.Opts;
        slug: string;
    };
}>;
export type GetFn = (slug: string, client: GQL.Client, opts?: GQL.Opts) => $.Xa<H2HEvent, H2HError>;
export declare const H2HEventSource: $.T.ZodObject<{
    bracketingSite: $.T.ZodLiteral<"startgg" | "challonge">;
    slug: $.T.ZodString;
}>;
export type H2HEventSource = $.T.infer<typeof H2HEventSource>;
export {};
//# sourceMappingURL=types.d.ts.map