import Response from "../services/models/response";
import CategoryModel from "../services/models/category.model";

export interface OverviewState {
    readonly loading: boolean;
    readonly categories: CategoryModel[] | null;
    readonly error: string | null;
}

const initialState: OverviewState = {
    loading: false,
    categories: [],
    error: null,
};

export const GETTINOVERVIEW = "GettingOverview";
export const gettingOverviewAction = () =>
    ({
        type: GETTINOVERVIEW,
    }) as const;

export const GOTOVERVIEW = "GotOverview";
export const gotOverviewAction = (response: Response<CategoryModel[]>) =>
    ({
        type: GOTOVERVIEW,
        categories: response.data ?? initialState.categories,
        error: response.error ?? initialState.error,
    }) as const;

type OverviewActions =
    | ReturnType<typeof gettingOverviewAction>
    | ReturnType<typeof gotOverviewAction>;

export const overviewReducer: any = (state: OverviewState = initialState, action: OverviewActions) => {
    switch (action.type) {
        case GETTINOVERVIEW:
            return {
                ...state,
                ...action,
                loading: true,
            };
        case GOTOVERVIEW:
            return {
                ...state,
                ...action,
                loading: false,
            };
        default:
            return state;
    }
};
