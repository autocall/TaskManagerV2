import Response from "../services/models/response";

export interface ProfileGitHubState {
    readonly submitting: boolean;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly Owner: string | "";
    readonly Token: string | "";
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: ProfileGitHubState = {
    loading: true, // prevents reinitialization of fields
    loaded: false,
    submitting: false,
    Owner: "",
    Token: "",
    error: null,
    errors: {},
};

export const GETTINGPROFILETIMEZONE = "GettingProfileGitHub";
export const gettingProfileGitHubAction = () =>
    ({
        type: GETTINGPROFILETIMEZONE,
    }) as const;

export const GOTPROFILETIMEZONE = "GotProfileGitHub";
export const gotProfileGitHubAction = (response: Response<{ Owner: string, Token: string }>) =>
    ({
        type: GOTPROFILETIMEZONE,
        Owner: response.data?.Owner ?? initialState.Owner,
        Token: response.data?.Token ?? initialState.Token,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const SUBMITTINGPROFILETIMEZONE = "SubmittingProfileGitHub";
export const submittingProfileGitHubAction = () =>
    ({
        type: SUBMITTINGPROFILETIMEZONE,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTEDPROFILETIMEZONE = "SubmittedProfileGitHub";
export const submittedProfileGitHubAction = (response: Response<any>) =>
    ({
        type: SUBMITTEDPROFILETIMEZONE,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CLOSEPROFILETIMEZONE = "CloseProfileGitHub";
export const closeProfileGitHubAction = () =>
    ({
        type: CLOSEPROFILETIMEZONE,
        Token: initialState.Token,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

type ProfileGitHubActions =
    | ReturnType<typeof gettingProfileGitHubAction>
    | ReturnType<typeof gotProfileGitHubAction>
    | ReturnType<typeof submittingProfileGitHubAction>
    | ReturnType<typeof submittedProfileGitHubAction>
    | ReturnType<typeof closeProfileGitHubAction>;

export const profileGitHubReducer: any = (state: ProfileGitHubState = initialState, action: ProfileGitHubActions) => {
    switch (action.type) {
        case GETTINGPROFILETIMEZONE:
            return {
                ...state,
                ...action,
                loading: true,
                loaded: false,
            };
        case GOTPROFILETIMEZONE:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: action.error ? false : true,
            };
        case SUBMITTINGPROFILETIMEZONE:
            return {
                ...state,
                ...action,
                submitting: true,
            };
        case SUBMITTEDPROFILETIMEZONE:
            return {
                ...state,
                ...action,
                submitting: false,
            };
        case CLOSEPROFILETIMEZONE:
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
