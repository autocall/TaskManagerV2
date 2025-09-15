import Response from "../services/models/response";

export interface ProfileGitHubTokenState {
    readonly submitting: boolean;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly Token: string | "";
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: ProfileGitHubTokenState = {
    loading: true, // prevents reinitialization of fields
    loaded: false,
    submitting: false,
    Token: "",
    error: null,
    errors: {},
};

export const GETTINGPROFILETIMEZONE = "GettingProfileGitHubToken";
export const gettingProfileGitHubTokenAction = () =>
    ({
        type: GETTINGPROFILETIMEZONE,
    }) as const;

export const GOTPROFILETIMEZONE = "GotProfileGitHubToken";
export const gotProfileGitHubTokenAction = (response: Response<{ Token: string }>) =>
    ({
        type: GOTPROFILETIMEZONE,
        Token: response.data?.Token ?? initialState.Token,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const SUBMITTINGPROFILETIMEZONE = "SubmittingProfileGitHubToken";
export const submittingProfileGitHubTokenAction = () =>
    ({
        type: SUBMITTINGPROFILETIMEZONE,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTEDPROFILETIMEZONE = "SubmittedProfileGitHubToken";
export const submittedProfileGitHubTokenAction = (response: Response<any>) =>
    ({
        type: SUBMITTEDPROFILETIMEZONE,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CLOSEPROFILETIMEZONE = "CloseProfileGitHubToken";
export const closeProfileGitHubTokenAction = () =>
    ({
        type: CLOSEPROFILETIMEZONE,
        Token: initialState.Token,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

type ProfileGitHubTokenActions =
    | ReturnType<typeof gettingProfileGitHubTokenAction>
    | ReturnType<typeof gotProfileGitHubTokenAction>
    | ReturnType<typeof submittingProfileGitHubTokenAction>
    | ReturnType<typeof submittedProfileGitHubTokenAction>
    | ReturnType<typeof closeProfileGitHubTokenAction>;

export const profileGitHubTokenReducer: any = (state: ProfileGitHubTokenState = initialState, action: ProfileGitHubTokenActions) => {
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
