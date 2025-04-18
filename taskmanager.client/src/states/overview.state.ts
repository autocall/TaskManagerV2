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

export const SUBMITTINGOVERVIEWTASK = "ProcessingOverviewTask";
export const processingOverviewTaskAction = (taskId: number) =>
    ({
        type: SUBMITTINGOVERVIEWTASK,
        processingTaskId: taskId,
    }) as const;

export const PROCESSEDOVERVIEWTASK = "ProcessedOverviewTask";
export const processedOverviewTaskAction = (taskId: number, response: Response<any>) =>
    ({
        type: PROCESSEDOVERVIEWTASK,
        processingTaskId: null,
        error: response.error ?? initialState.error,
    }) as const;

export const RELOADOVERVIEWCATEGORIES = "ReloadOverviewCategories";
export const reloadOverviewCategoriesAction = (categories: CategoryModel[]) =>
    ({
        type: RELOADOVERVIEWCATEGORIES,
        categories: categories,
    }) as const;

type OverviewActions =
    | ReturnType<typeof gettingOverviewAction>
    | ReturnType<typeof gotOverviewAction>
    | ReturnType<typeof processingOverviewTaskAction>
    | ReturnType<typeof processedOverviewTaskAction>
    | ReturnType<typeof reloadOverviewCategoriesAction>;

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
        case RELOADOVERVIEWCATEGORIES:
            return {
                ...state,
                ...action,
            };
        default:
            return state;
    }
};
