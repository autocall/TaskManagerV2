import Response from "../services/models/response";

export interface LoginState {
    readonly submitting: boolean;
    readonly email: string;
    readonly password: string;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: LoginState = {
    submitting: false,
    email: "",
    password: "",
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
        error: response.error,
        errors: response.errors,
    }) as const;

type LoginActions = ReturnType<typeof submittingLoginAction> | ReturnType<typeof submittedLoginAction>;

export const loginReducer: any = (state: LoginState = initialState, action: LoginActions) => {
    switch (action.type) {
        case SUBMITTINGLOGIN:
            return {
                ...state,
                submitting: true,
                error: initialState.error,
                errors: initialState.errors,
            };
        case SUBMITTEDLOGIN:
            return {
                ...state,
                submitting: false,
                error: action.error,
                errors: action.errors ?? initialState.errors,
            };
        default:
            return state;
    }
};