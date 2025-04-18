import { TaskColumnEnum } from "../enums/task.column.enum";
import { TaskKindEnum } from "../enums/task.kind.enum";
import { TaskStatusEnum } from "../enums/task.status.enum";
import FileModel from "../services/models/file.model";
import Response from "../services/models/response";
import TaskModel, { TaskData, ITaskData } from "../services/models/task.model";

export interface TaskState extends ITaskData {
    readonly submitting: boolean;
    readonly submittingTaskId: number | null;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly Index: number | null;
    readonly Title: string;
    readonly Description: string;
    readonly ProjectId: number | null;
    readonly CategoryId: number | null;
    readonly Column: TaskColumnEnum;
    readonly Kind: TaskKindEnum | null;
    readonly Status: TaskStatusEnum | null;
    readonly Files: FileModel[] | null;
    
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: TaskState = {
    loading: true, // prevents reinitialization of fields
    loaded: false,
    submitting: false,
    submittingTaskId: null,
    ...new TaskData(),
    error: null,
    errors: {},
};

export const GETTINGTASK = "GettingTask";
export const gettingTaskAction = () =>
    ({
        type: GETTINGTASK,
    }) as const;

export const GOTTASK = "GotTask";
export const gotTaskAction = (response: Response<TaskModel>) =>
    ({
        type: GOTTASK,
        ...new TaskData(response.data),
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CREATETASK = "CreateTask";
export const createTaskAction = (data: ITaskData) =>
    ({
        type: CREATETASK,
        ...data,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTINGTASK = "SubmittingTask";
export const submittingTaskAction = () =>
    ({
        type: SUBMITTINGTASK,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTEDTASK = "SubmittedTask";
export const submittedTaskAction = (response: Response<TaskModel>) =>
    ({
        type: SUBMITTEDTASK,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CLOSETASK = "CloseTask";
export const closeTaskAction = () =>
    ({
        type: CLOSETASK,
        ...new TaskData(),
        error: initialState.error,
        errors: initialState.errors,
    }) as const;
    
type TaskActions =
    | ReturnType<typeof gettingTaskAction>
    | ReturnType<typeof gotTaskAction>
    | ReturnType<typeof createTaskAction>
    | ReturnType<typeof submittingTaskAction>
    | ReturnType<typeof submittedTaskAction>
    | ReturnType<typeof closeTaskAction>;

export const taskReducer: any = (state: TaskState = initialState, action: TaskActions) => {
    switch (action.type) {
        case GETTINGTASK:
            return {
                ...state,
                ...action,
                loading: true,
                loaded: false,
            };
        case GOTTASK:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: action.error ? false : true,
            };
        case CREATETASK:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: true,
            };
        case SUBMITTINGTASK:
            return {
                ...state,
                ...action,
                submitting: true,
            };
        case SUBMITTEDTASK:
            return {
                ...state,
                ...action,
                submitting: false,
            };
        case CLOSETASK:
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
