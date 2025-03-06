import { error } from "console";
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

export const GETTINGCATEGORIES = "GettingCategories";
export const gettingCategoriesAction = () =>
    ({
        type: GETTINGCATEGORIES,
    }) as const;

export const GOTCATEGORIES = "GotCategories";
export const gotCategoriesAction = (response: Response<CategoryModel[]>) =>
    ({
        type: GOTCATEGORIES,
        categories: response.data ?? initialState.categories,
        error: response.error ?? initialState.error,
    }) as const;

export const DELETINGPROJECT = "DeletingCategory";
export const deletingCategoryAction = () =>
    ({
        type: DELETINGPROJECT,
    }) as const;

export const DELETEDPROJECT = "DeletedCategory";
export const deletedCategoryAction = (response: Response<any>) =>
    ({
        type: DELETEDPROJECT,
        error: response.error ?? initialState.error,
    }) as const;

type OverviewActions =
    | ReturnType<typeof gettingCategoriesAction>
    | ReturnType<typeof gotCategoriesAction>
    | ReturnType<typeof deletingCategoryAction>
    | ReturnType<typeof deletedCategoryAction>;

export const overviewReducer: any = (state: OverviewState = initialState, action: OverviewActions) => {
    switch (action.type) {
        case GETTINGCATEGORIES:
            return {
                ...state,
                ...action,
                loading: true,
            };
        case GOTCATEGORIES:
            return {
                ...state,
                ...action,
                loading: false,
            };
        case DELETINGPROJECT:
            return {
                ...state,
                ...action,
                loading: true,
            };
        case DELETEDPROJECT:
            return {
                ...state,
                ...action,
                loading: false,
            };
        default:
            return state;
    }
};
