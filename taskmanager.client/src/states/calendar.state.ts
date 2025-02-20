import { error } from "console";
import Response from "../services/models/response";
import CalendarDayModel from "../services/models/calendar.day.model";

export interface CalendarState {
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly days: CalendarDayModel[] | null;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: CalendarState = {
    loading: false,
    loaded: false,
    days: [],
    error: null,
    errors: {},
};

export const GETTINGCURRERNTCALENDAR  = "GettingCurrentCalendar";
export const gettingCurrentCalendarAction = () =>
    ({
        type: GETTINGCURRERNTCALENDAR,
    }) as const;

export const GOTCURRENTCALENDAR = "GotCurrentCalendar";
export const gotCurrentCalendarAction = (response: Response<CalendarDayModel[]>) =>
    ({
        type: GOTCURRENTCALENDAR,
        days: response.data,
        error: response.error,
    }) as const;

type CalendarActions =
    | ReturnType<typeof gettingCurrentCalendarAction>
    | ReturnType<typeof gotCurrentCalendarAction>;

export const calendarReducer: any = (state: CalendarState = initialState, action: CalendarActions) => {
    switch (action.type) {
        case GETTINGCURRERNTCALENDAR:
            return {
                ...state,
                loading: true,
                days: initialState.days,
                error: initialState.error,
            };
        case GOTCURRENTCALENDAR:
            return {
                ...state,
                loading: false,
                loaded: action.error ? false : true,
                days: action.days,
                error: action.error,
            };
        default:
            return state;
    }
};
