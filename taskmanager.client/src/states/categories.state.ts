import { error } from "console";
import Response from "../services/models/response";
import CategoryModel from "../services/models/category.model";

export interface CategoriesState {
    readonly loading: boolean;
    readonly categories: CategoryModel[] | null;
    readonly error: string | null;
}

const initialState: CategoriesState = {
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

export const DELETINGCATEGORY = "DeletingCategory";
export const deletingCategoryAction = () =>
    ({
        type: DELETINGCATEGORY,
    }) as const;

export const DELETEDCATEGORY = "DeletedCategory";
export const deletedCategoryAction = (response: Response<any>) =>
    ({
        type: DELETEDCATEGORY,
        error: response.error ?? initialState.error,
    }) as const;

type CategoriesActions =
    | ReturnType<typeof gettingCategoriesAction>
    | ReturnType<typeof gotCategoriesAction>
    | ReturnType<typeof deletingCategoryAction>
    | ReturnType<typeof deletedCategoryAction>;

export const categoriesReducer: any = (state: CategoriesState = initialState, action: CategoriesActions) => {
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
        case DELETINGCATEGORY:
            return {
                ...state,
                ...action,
                loading: true,
            };
        case DELETEDCATEGORY:
            return {
                ...state,
                ...action,
                loading: false,
            };
        default:
            return state;
    }
};
