import { error } from "console";
import Response from "../services/models/response";
import CalendarModel from "../services/models/calendar.day.models";

export interface CalendarState {
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly calendar: CalendarModel | null;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: CalendarState = {
    loading: false,
    loaded: false,
    calendar: null,
    error: null,
    errors: {},
};

export const GETTINGCURRERNTCALENDAR  = "GettingCurrentCalendar";
export const gettingCurrentCalendarAction = () =>
    ({
        type: GETTINGCURRERNTCALENDAR,
    }) as const;

export const GOTCURRENTCALENDAR = "GotCurrentCalendar";
export const gotCurrentCalendarAction = (response: Response<CalendarModel>) =>
    ({
        type: GOTCURRENTCALENDAR,
        calendar: response.data,
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
                calendar: initialState.calendar,
                error: initialState.error,
            };
        case GOTCURRENTCALENDAR:
            return {
                ...state,
                loading: false,
                loaded: action.error ? false : true,
                calendar: action.calendar,
                error: action.error,
            };
        default:
            return state;
    }
};
