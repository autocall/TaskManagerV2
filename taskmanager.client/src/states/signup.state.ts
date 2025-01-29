import Response from "../services/models/response";

export interface SignUpState {
    readonly submitting: boolean;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly confirmPassword: string
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: SignUpState = {
    submitting: false,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: null,
    errors: {},
};

export const SUBMITTINGSIGNUP = "SubmittingSignUp";
export const submittingSignUpAction = () =>
    ({
        type: SUBMITTINGSIGNUP,
    }) as const;

export const SUBMITTEDSIGNUP = "SubmittedSignUp";
export const submittedSignUpAction = (response: Response<any>) =>
    ({
        type: SUBMITTEDSIGNUP,
        error: response.error,
        errors: response.errors,
    }) as const;

type SignUpActions = ReturnType<typeof submittingSignUpAction> | ReturnType<typeof submittedSignUpAction>;

export const signUpReducer: any = (state: SignUpState = initialState, action: SignUpActions) => {
    switch (action.type) {
        case SUBMITTINGSIGNUP:
            return {
                ...state,
                submitting: true,
                error: initialState.error,
                errors: initialState.errors,
            };
        case SUBMITTEDSIGNUP:
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