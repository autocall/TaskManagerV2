import Response from "../services/models/response";

export interface LoginState {
    readonly submitting: boolean;
    readonly Email: string;
    readonly Password: string;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: LoginState = {
    submitting: false,
    Email: "",
    Password: "",
    error: null,
    errors: {},
};

export const SUBMITTINGLOGIN = "SubmittingLogin";
export const submittingLoginAction = () =>
    ({
        type: SUBMITTINGLOGIN,
    }) as const;

export const SUBMITTEDLOGIN = "SubmittedLogin";
export const submittedLoginAction = (response: Response<any>) =>
    ({
        type: SUBMITTEDLOGIN,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

type LoginActions = ReturnType<typeof submittingLoginAction> | ReturnType<typeof submittedLoginAction>;

export const loginReducer: any = (state: LoginState = initialState, action: LoginActions) => {
    switch (action.type) {
        case SUBMITTINGLOGIN:
            return {
                ...state,
                ...action,
                submitting: true,
            };
        case SUBMITTEDLOGIN:
            return {
                ...state,
                ...action,
                submitting: false,
            };
        default:
            return state;
    }
};