import Response from "../services/models/response";
import EventModel, { EventData, ExtendedEventData, IEventData, IExtendedEventData } from "../services/models/event.model";
import stringExtension from "../extensions/string.extension";

export interface EventState extends IExtendedEventData {
    readonly submitting: boolean;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly DateString: string;
    readonly Date: Date;
    readonly Name: string;
    readonly Description: string;
    readonly RepeatType: number;
    readonly RepeatValue: number;
    readonly Birthday: boolean;
    readonly Holiday: boolean;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: EventState = {
    loading: true, // prevents reinitialization of fields
    loaded: false,
    submitting: false,
    ...(new ExtendedEventData() as IExtendedEventData),
    error: null,
    errors: {},
};

export const GETTINGEVENT = "GettingEvent";
export const gettingEventAction = () =>
    ({
        type: GETTINGEVENT,
    }) as const;

export const GOTEVENT = "GotEvent";
export const gotEventAction = (response: Response<EventModel>) =>
    ({
        type: GOTEVENT,
        ...new ExtendedEventData(response.data),
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CREATEEVENT = "CreateEvent";
export const createEventAction = (date: Date) =>
    ({
        type: CREATEEVENT,
        ...ExtendedEventData.fromDate(date),
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTINGEVENT = "SubmittingEvent";
export const submittingEventAction = () =>
    ({
        type: SUBMITTINGEVENT,
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

export const SUBMITTEDEVENT = "SubmittedEvent";
export const submittedEventAction = (response: Response<EventModel>) =>
    ({
        type: SUBMITTEDEVENT,
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CLOSEEVENT = "CloseEvent";
export const closeEventAction = () =>
    ({
        type: CLOSEEVENT,
        ...new ExtendedEventData(),
        error: initialState.error,
        errors: initialState.errors,
    }) as const;

type EventActions =
    | ReturnType<typeof gettingEventAction>
    | ReturnType<typeof gotEventAction>
    | ReturnType<typeof createEventAction>
    | ReturnType<typeof submittingEventAction>
    | ReturnType<typeof submittedEventAction>
    | ReturnType<typeof closeEventAction>;

export const eventReducer: any = (state: EventState = initialState, action: EventActions) => {
    switch (action.type) {
        case GETTINGEVENT:
            return {
                ...state,
                ...action,
                loading: true,
                loaded: false,
            };
        case GOTEVENT:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: action.error ? false : true,
            };
        case CREATEEVENT:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: true,
            };
        case SUBMITTINGEVENT:
            return {
                ...state,
                ...action,
                submitting: true,
            };
        case SUBMITTEDEVENT:
            return {
                ...state,
                ...action,
                submitting: false,
            };
        case CLOSEEVENT:
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
