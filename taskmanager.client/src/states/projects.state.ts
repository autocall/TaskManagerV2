import { error } from "console";
import Response from "../services/models/response";
import ProjectModel from "../services/models/project.model";

export interface ProjectsState {
    readonly loading: boolean;
    readonly projects: ProjectModel[] | null;
    readonly error: string | null;
}

const initialState: ProjectsState = {
    loading: false,
    projects: [],
    error: null,
};

export const GETTINGPROJECTS = "GettingProjects";
export const gettingProjectsAction = () =>
    ({
        type: GETTINGPROJECTS,
    }) as const;

export const GOTPROJECTS = "GotProjects";
export const gotProjectsAction = (response: Response<ProjectModel[]>) =>
    ({
        type: GOTPROJECTS,
        projects: response.data,
        error: response.error,
    }) as const;

export const DELETINGPROJECT = "DeletingProject";
export const deletingProjectAction = () =>
    ({
        type: DELETINGPROJECT,
    }) as const;

export const DELETEDPROJECT = "DeletedProject";
export const deletedProjectAction = (response: Response<any>) =>
    ({
        type: DELETEDPROJECT,
        projects: response.data,
        error: response.error,
    }) as const;

type ProjectsActions =
    | ReturnType<typeof gettingProjectsAction>
    | ReturnType<typeof gotProjectsAction>
    | ReturnType<typeof deletingProjectAction>
    | ReturnType<typeof deletedProjectAction>;

export const projectsReducer: any = (state: ProjectsState = initialState, action: ProjectsActions) => {
    switch (action.type) {
        case GETTINGPROJECTS:
            return {
                ...state,
                loading: true,
                projects: initialState.projects,
                error: initialState.error,
            };
        case GOTPROJECTS:
            return {
                ...state,
                loading: false,
                projects: action.projects,
                error: action.error,
            };
        case DELETINGPROJECT:
            return {
                ...state,
                loading: true,
                error: initialState.error,
            };
        case DELETEDPROJECT:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
