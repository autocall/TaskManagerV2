import Response from "../services/models/response";
import EventModel, { EventData, IEventData } from "../services/models/event.model";
import { EventTypeEnum } from "../enums/event.type.enum";
import { EventRepeatEnum } from "../enums/event.repeat.enum";

export interface EventState extends IEventData {
    readonly submitting: boolean;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly Date: string;
    readonly Name: string;
    readonly Description: string;
    readonly RepeatType: EventRepeatEnum;
    readonly RepeatValue: number;
    readonly Type: EventTypeEnum;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: EventState = {
    loading: true, // prevents reinitialization of fields
    loaded: false,
    submitting: false,
    ...new EventData(),
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
        ...new EventData(response.data),
        error: response.error ?? initialState.error,
        errors: response.errors ?? initialState.errors,
    }) as const;

export const CREATEEVENT = "CreateEvent";
export const createEventAction = (data: IEventData) =>
    ({
        type: CREATEEVENT,
        ...data,
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
        ...new EventData(),
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
