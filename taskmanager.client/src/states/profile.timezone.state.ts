import { error } from "console";
import Response from "../services/models/response";
import { TimeZoneModel } from "../services/models/timezone.model";

export interface ProfileTimeZoneState {
    readonly submitting: boolean;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly TimeZones: TimeZoneModel[];
    readonly TimeZoneId: string | "";
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: ProfileTimeZoneState = {
    loading: true, // prevents reinitialization of fields
    loaded: false,
    submitting: false,
    TimeZones: [],
    TimeZoneId: "",
    error: null,
    errors: {},
};

export const GETTINGPROFILETIMEZONE = "GettingProfileTimeZone";
export const gettingProfileTimeZoneAction = () =>
    ({
        type: GETTINGPROFILETIMEZONE,
    }) as const;

export const GOTPROFILETIMEZONE = "GotProfileTimeZone";
export const gotProfileTimeZoneAction = (response: Response<{ TimeZones: TimeZoneModel[]; TimeZoneId: string }>) =>
    ({
        type: GOTPROFILETIMEZONE,
        TimeZones: response.data?.TimeZones ?? initialState.TimeZones,
        TimeZoneId: response.data?.TimeZoneId ?? initialState.TimeZoneId,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const SUBMITTINGPROFILETIMEZONE = "SubmittingProfileTimeZone";
export const submittingProfileTimeZoneAction = () =>
    ({
        type: SUBMITTINGPROFILETIMEZONE,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTEDPROFILETIMEZONE = "SubmittedProfileTimeZone";
export const submittedProfileTimeZoneAction = (response: Response<any>) =>
    ({
        type: SUBMITTEDPROFILETIMEZONE,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CLOSEPROFILETIMEZONE = "CloseProfileTimeZone";
export const closeProfileTimeZoneAction = () =>
    ({
        type: CLOSEPROFILETIMEZONE,
        TimeZones: initialState.TimeZones,
        TimeZoneId: initialState.TimeZoneId,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

type ProfileTimeZoneActions =
    | ReturnType<typeof gettingProfileTimeZoneAction>
    | ReturnType<typeof gotProfileTimeZoneAction>
    | ReturnType<typeof submittingProfileTimeZoneAction>
    | ReturnType<typeof submittedProfileTimeZoneAction>
    | ReturnType<typeof closeProfileTimeZoneAction>;

export const profileTimeZoneReducer: any = (state: ProfileTimeZoneState = initialState, action: ProfileTimeZoneActions) => {
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
