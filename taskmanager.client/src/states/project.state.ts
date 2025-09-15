import { error } from "console";
import Response from "../services/models/response";
import ProjectModel from "../services/models/project.model";
import { TaskColumnEnum } from "../enums/task.column.enum";

export interface ProjectState {
    readonly submitting: boolean;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly Name: string;
    readonly DefaultColumn: number;
    readonly GitHubRepo: string;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: ProjectState = {
    loading: true, // prevents reinitialization of fields
    loaded: false,
    submitting: false,
    Name: "",
    DefaultColumn: TaskColumnEnum.First,
    GitHubRepo: "",
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
        Name: response.data?.Name ?? initialState.Name,
        DefaultColumn: response.data?.DefaultColumn ?? initialState.DefaultColumn,
        GitHubRepo: response.data?.GitHubRepo ?? initialState.GitHubRepo,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CREATEPROJECT = "CreateProject";
export const createProjectAction = () =>
    ({
        type: CREATEPROJECT,
        Name: initialState.Name,
        DefaultColumn: initialState.DefaultColumn,
        GitHubRepo: initialState.GitHubRepo,
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
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CLOSEPROJECT = "CloseProject";
export const closeProjectAction = () =>
    ({
        type: CLOSEPROJECT,
        Name: initialState.Name,
        DefaultColumn: initialState.DefaultColumn,
        GitHubRepo: initialState.GitHubRepo,
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
                ...action,
                loading: true,
                loaded: false,
            };
        case GOTPROJECT:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: action.error ? false : true,
            };
        case CREATEPROJECT:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: true,
            };
        case SUBMITTINGPROJECT:
            return {
                ...state,
                ...action,
                submitting: true,
            };
        case SUBMITTEDPROJECT:
            return {
                ...state,
                ...action,
                submitting: false,
            };
        case CLOSEPROJECT:
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
