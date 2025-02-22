import Response from "../services/models/response";

export interface SignUpState {
    readonly submitting: boolean;
    readonly UserName: string;
    readonly Email: string;
    readonly Password: string;
    readonly ConfirmPassword: string
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: SignUpState = {
    submitting: false,
    UserName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
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
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

type SignUpActions = ReturnType<typeof submittingSignUpAction> | ReturnType<typeof submittedSignUpAction>;

export const signUpReducer: any = (state: SignUpState = initialState, action: SignUpActions) => {
    switch (action.type) {
        case SUBMITTINGSIGNUP:
            return {
                ...state,
                ...action,
                submitting: true,
            };
        case SUBMITTEDSIGNUP:
            return {
                ...state,
                ...action,
                submitting: false,
            };
        default:
            return state;
    }
};