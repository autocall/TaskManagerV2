import { error } from "console";
import Response from "../services/models/response";
import CategoryModel from "../services/models/category.model";

export interface CategoryState {
    readonly submitting: boolean;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly Name: string;
    readonly Color: string;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: CategoryState = {
    loading: true, // prevents reinitialization of fields
    loaded: false,
    submitting: false,
    Name: "",
    Color: "#7bc6ee",
    error: null,
    errors: {},
};

export const GETTINGCATEGORY = "GettingCategory";
export const gettingCategoryAction = () =>
    ({
        type: GETTINGCATEGORY,
    }) as const;

export const GOTCATEGORY = "GotCategory";
export const gotCategoryAction = (response: Response<CategoryModel>) =>
    ({
        type: GOTCATEGORY,
        Name: response.data?.Name ?? initialState.Name,
        Color: response.data?.Color ?? initialState.Color,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CREATECATEGORY = "CreateCategory";
export const createCategoryAction = () =>
    ({
        type: CREATECATEGORY,
        Name: initialState.Name,
        Color: initialState.Color,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTINGCATEGORY = "SubmittingCategory";
export const submittingCategoryAction = () =>
    ({
        type: SUBMITTINGCATEGORY,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTEDCATEGORY = "SubmittedCategory";
export const submittedCategoryAction = (response: Response<CategoryModel>) =>
    ({
        type: SUBMITTEDCATEGORY,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CLOSECATEGORY = "CloseCategory";
export const closeCategoryAction = () =>
    ({
        type: CLOSECATEGORY,
        Name: initialState.Name,
        Color: initialState.Color,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

type CategoryActions =
    | ReturnType<typeof gettingCategoryAction>
    | ReturnType<typeof gotCategoryAction>
    | ReturnType<typeof createCategoryAction>
    | ReturnType<typeof submittingCategoryAction>
    | ReturnType<typeof submittedCategoryAction>
    | ReturnType<typeof closeCategoryAction>;

export const categoryReducer: any = (state: CategoryState = initialState, action: CategoryActions) => {
    switch (action.type) {
        case GETTINGCATEGORY:
            return {
                ...state,
                ...action,
                loading: true,
                loaded: false,
            };
        case GOTCATEGORY:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: action.error ? false : true,
            };
        case CREATECATEGORY:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: true,
            };
        case SUBMITTINGCATEGORY:
            return {
                ...state,
                ...action,
                submitting: true,
            };
        case SUBMITTEDCATEGORY:
            return {
                ...state,
                ...action,
                submitting: false,
            };
        case CLOSECATEGORY:
            return {
                ...state,
                ...action,
                loading: true, // prevents reinitialization of fields
                loaded: false,
                submitting: false,
            };
        default:
            return state;
    }
};
