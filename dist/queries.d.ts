import * as $ from "@dz-ssbm/util";
import * as GQL from "@dz-ssbm/gql";
export declare const setsOp: GQL.Operation<{
    page: number;
    phaseGroupId: number;
}, {
    phaseGroup: {
        id: number;
        bracketType: string;
        sets: {
            pageInfo: {
                total: number;
            };
            nodes: {
                id: number;
                fullRoundText: string;
                round: number;
                wPlacement: number;
                lPlacement: number;
                displayScore: string;
                identifier: string;
                winnerId: number;
                slots: {
                    entrant: {
                        id: number;
                    };
                }[];
                state: number;
                games?: {
                    orderNum: number;
                    entrant1Score: number;
                    entrant2Score: number;
                    selections: {
                        id: number;
                        character: {
                            id: number;
                            name: string;
                        };
                        entrant: {
                            id: number;
                        };
                        orderNum: number;
                        selectionValue: string;
                    }[];
                    winnerId?: number | null | undefined;
                }[] | null | undefined;
            }[];
        };
    };
}>;
export declare const tourneyOp: GQL.Operation<{
    pageE: number;
    pageS: number;
    slug: string;
}, {
    event: {
        id: string | number;
        numEntrants: number;
        name: string;
        slug: string;
        state: string;
        tournament: {
            id: string | number;
            name: string;
            endAt: number;
            images: {
                url: string;
                type: string;
            }[];
        };
        entrants: {
            pageInfo: {
                total: number;
            };
            nodes: {
                id: number;
                initialSeedNum: number;
                participants: {
                    gamerTag: string;
                    player: {
                        id: number;
                        gamerTag: string;
                        prefix?: string | null | undefined;
                        user?: {
                            images: {
                                url: string;
                                type: string;
                            }[];
                            genderPronoun?: string | null | undefined;
                            name?: string | null | undefined;
                            authorizations?: {
                                externalUsername: string;
                                type: string;
                            }[] | null | undefined;
                        } | null | undefined;
                    };
                    prefix?: string | null | undefined;
                }[];
            }[];
        };
        standings: {
            pageInfo: {
                total: number;
            };
            nodes: {
                id: number;
                placement: number;
                isFinal: boolean;
                entrant: {
                    id: number;
                };
            }[];
        };
        phaseGroups: {
            id: number;
            phase: {
                id: number;
                name: string;
                phaseOrder: number;
            };
            displayIdentifier: string;
        }[];
    };
}>;
export declare const tourneyOpSmall: GQL.Operation<{
    pageE: number;
    pageS: number;
    slug: string;
}, {
    event: {
        id: string | number;
        numEntrants: number;
        name: string;
        slug: string;
        state: string;
        tournament: {
            id: string | number;
            name: string;
            endAt: number;
            images: {
                url: string;
                type: string;
            }[];
        };
        entrants: {
            pageInfo: {
                total: number;
            };
            nodes: {
                id: number;
                initialSeedNum: number;
                participants: {
                    gamerTag: string;
                    player: {
                        id: number;
                        gamerTag: string;
                        prefix?: string | null | undefined;
                        user?: {
                            images: {
                                url: string;
                                type: string;
                            }[];
                            genderPronoun?: string | null | undefined;
                            name?: string | null | undefined;
                            authorizations?: {
                                externalUsername: string;
                                type: string;
                            }[] | null | undefined;
                        } | null | undefined;
                    };
                    prefix?: string | null | undefined;
                }[];
            }[];
        };
        standings: {
            pageInfo: {
                total: number;
            };
            nodes: {
                id: number;
                placement: number;
                isFinal: boolean;
                entrant: {
                    id: number;
                };
            }[];
        };
        phaseGroups: {
            id: number;
            phase: {
                id: number;
                name: string;
                phaseOrder: number;
            };
            displayIdentifier: string;
        }[];
    };
}>;
export type SetsOp = typeof setsOp;
export type SetsOpData = $.T.infer<SetsOp["rt"]>;
export type TourneyOp = typeof tourneyOp;
export type TourneyOpData = $.T.infer<TourneyOp["rt"]>;
//# sourceMappingURL=queries.d.ts.map