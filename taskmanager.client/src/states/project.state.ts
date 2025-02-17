import { error } from "console";
import Response from "../services/models/response";
import ProjectModel from "../services/models/project.model";

export interface ProjectState {
    readonly submitting: boolean;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly Name: string;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: ProjectState = {
    loading: false,
    loaded: false,
    submitting: false,
    Name: "",
    error: null,
    errors: {},
};

export const GETTINGPROJECT = "GettingProject";
export const gettingProjectAction = () =>
    ({
        type: GETTINGPROJECT,
    }) as const;

export const GOTPROJECT = "GotProject";
export const gotProjectAction = (response: Response<ProjectModel>) =>
    ({
        type: GOTPROJECT,
        Name: response.data?.Name,
        error: response.error,
        errors: response.errors,
    }) as const;

export const CREATEPROJECT = "CreateProject";
export const createProjectAction = () =>
    ({
        type: CREATEPROJECT,
        Name: initialState.Name,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTINGPROJECT = "SubmittingProject";
export const submittingProjectAction = () =>
    ({
        type: SUBMITTINGPROJECT,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTEDPROJECT = "SubmittedProject";
export const submittedProjectAction = (response: Response<ProjectModel>) =>
    ({
        type: SUBMITTEDPROJECT,
        error: response.error,
        errors: response.errors,
    }) as const;

export const CLOSEPROJECT = "CloseProject";
export const closeProjectAction = () =>
    ({
        type: CLOSEPROJECT,
        Name: initialState.Name,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

type ProjectActions =
    | ReturnType<typeof gettingProjectAction>
    | ReturnType<typeof gotProjectAction>
    | ReturnType<typeof createProjectAction>
    | ReturnType<typeof submittingProjectAction>
    | ReturnType<typeof submittedProjectAction>
    | ReturnType<typeof closeProjectAction>;

export const projectReducer: any = (state: ProjectState = initialState, action: ProjectActions) => {
    switch (action.type) {
        case GETTINGPROJECT:
            return {
                ...state,
                loading: true,
                loaded: false,
                submitting: false,
                Name: initialState.Name,
                error: initialState.error,
                errors: initialState.errors,
            };
        case GOTPROJECT:
            return {
                ...state,
                loading: false,
                loaded: action.error ? false : true,
                submitting: false,
                Name: action.Name,
                error: action.error ?? initialState.error,
                errors: action.errors ?? initialState.errors,
            };
        case CREATEPROJECT:
            return {
                ...state,
                loading: false,
                loaded: true,
                submitting: false,
                Name: initialState.Name,
                error: initialState.error,
                errors: initialState.errors,
            };
        case SUBMITTINGPROJECT:
            return {
                ...state,
                loading: false,
                submitting: true,
                Name: state.Name,
                error: initialState.error,
                errors: initialState.errors,
            };
        case SUBMITTEDPROJECT:
            return {
                ...state,
                loading: false,
                submitting: false,
                error: action.error ?? initialState.error,
                errors: action.errors ?? initialState.errors,
            };
        case CLOSEPROJECT:
            return {
                ...state,
                loading: false,
                submitting: false,
                Name: initialState.Name,
                error: initialState.error,
                errors: initialState.errors,
            };
        default:
            return state;
    }
};
