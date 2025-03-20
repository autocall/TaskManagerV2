import { TaskStatusEnum } from "../enums/task.status.enum";
import Response from "../services/models/response";
import CommentModel, { CommentData, ICommentData } from "../services/models/comment.model";

export interface CommentState extends ICommentData {
    readonly submitting: boolean;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly Date: string;
    readonly WorkHours: number;
    readonly Text: string;
    readonly Status: TaskStatusEnum | null;
    readonly TaskIndex: number | null;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: CommentState = {
    loading: true, // prevents reinitialization of fields
    loaded: false,
    submitting: false,
    ...new CommentData(),
    TaskIndex: null,
    error: null,
    errors: {},
};

export const GETTINGCOMMENT = "GettingComment";
export const gettingCommentAction = () =>
    ({
        type: GETTINGCOMMENT,
    }) as const;

export const GOTCOMMENT = "GotComment";
export const gotCommentAction = (response: Response<CommentModel>) =>
    ({
        type: GOTCOMMENT,
        ...new CommentData(response.data),
        TaskIndex: response.data?.TaskIndex, // added
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CREATECOMMENT = "CreateComment";
export const createCommentAction = (data: ICommentData) =>
    ({
        type: CREATECOMMENT,
        ...data,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTINGCOMMENT = "SubmittingComment";
export const submittingCommentAction = () =>
    ({
        type: SUBMITTINGCOMMENT,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTEDCOMMENT = "SubmittedComment";
export const submittedCommentAction = (response: Response<CommentModel>) =>
    ({
        type: SUBMITTEDCOMMENT,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CLOSECOMMENT = "CloseComment";
export const closeCommentAction = () =>
    ({
        type: CLOSECOMMENT,
        ...new CommentData(),
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const DELETINGCOMMENT = "DeletingComment";
export const deletingCommentAction = () =>
    ({
        type: DELETINGCOMMENT,
    }) as const;

export const DELETEDCOMMENT = "DeletedComment";
export const deletedCommentAction = (response: Response<any>) =>
    ({
        type: DELETEDCOMMENT,
        error: response.error ?? initialState.error,
    }) as const;

type CommentActions =
    | ReturnType<typeof gettingCommentAction>
    | ReturnType<typeof gotCommentAction>
    | ReturnType<typeof createCommentAction>
    | ReturnType<typeof submittingCommentAction>
    | ReturnType<typeof submittedCommentAction>
    | ReturnType<typeof closeCommentAction>;

export const commentReducer: any = (state: CommentState = initialState, action: CommentActions) => {
    switch (action.type) {
        case GETTINGCOMMENT:
            return {
                ...state,
                ...action,
                loading: true,
                loaded: false,
            };
        case GOTCOMMENT:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: action.error ? false : true,
            };
        case CREATECOMMENT:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: true,
            };
        case SUBMITTINGCOMMENT:
            return {
                ...state,
                ...action,
                submitting: true,
            };
        case SUBMITTEDCOMMENT:
            return {
                ...state,
                ...action,
                submitting: false,
            };
        case CLOSECOMMENT:
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
