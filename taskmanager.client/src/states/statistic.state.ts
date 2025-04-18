import Response from "../services/models/response";
import StatisticModel from "../services/models/statistic.model";

export interface StatisticState {
    readonly loading: boolean;
    readonly statistic: StatisticModel | null;
    readonly error: string | null;
}

const initialState: StatisticState = {
    loading: false,
    statistic: null,
    error: null,
};

export const GETTINGSTATISTIC = "GettingStatistic";
export const gettingStatisticAction = () =>
    ({
        type: GETTINGSTATISTIC,
        statistic: initialState.statistic,
    }) as const;

export const GOTSTATISTIC = "GotStatistic";
export const gotStatisticAction = (response: Response<StatisticModel>) =>
    ({
        type: GOTSTATISTIC,
        statistic: response.data ?? initialState.statistic,
        error: response.error ?? initialState.error,
    }) as const;

type StatisticActions = ReturnType<typeof gettingStatisticAction> | ReturnType<typeof gotStatisticAction>;

export const statisticReducer: any = (state: StatisticState = initialState, action: StatisticActions) => {
    switch (action.type) {
        case GETTINGSTATISTIC:
            return {
                ...state,
                ...action,
                loading: true,
            };
        case GOTSTATISTIC:
            return {
                ...state,
                ...action,
                loading: false,
            };
        default:
            return state;
    }
};
