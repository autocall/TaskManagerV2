import Response from "../services/models/response";
import CategoryModel from "../services/models/category.model";

export interface OverviewState {
    readonly loading: boolean;
    readonly categories: CategoryModel[];
    readonly processingTaskId: number | null;
    readonly error: string | null;
}

const initialState: OverviewState = {
    loading: false,
    categories: [],
    processingTaskId: null,
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

export const SUBMITTINGOVERVIEWTASK = "ProcessingOverviewComment";
export const ProcessingOverviewTaskAction = (taskId: number) => ({
    type: SUBMITTINGOVERVIEWTASK,
    processingTaskId: taskId,
});

export const PROCESSEDOVERVIEWTASK = "ProcessedOverviewComment";
export const processedOverviewTaskAction = (taskId: number, response: Response<any>) => ({
    type: PROCESSEDOVERVIEWTASK,
    processingTaskId: null,
});

type OverviewActions =
    | ReturnType<typeof gettingOverviewAction>
    | ReturnType<typeof gotOverviewAction>
    | ReturnType<typeof ProcessingOverviewTaskAction>
    | ReturnType<typeof processedOverviewTaskAction>;

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
        case SUBMITTINGOVERVIEWTASK:
            return {
                ...state,
                ...action,
            };
        case PROCESSEDOVERVIEWTASK:
            return {
                ...state,
                ...action,
            };
        default:
            return state;
    }
};
