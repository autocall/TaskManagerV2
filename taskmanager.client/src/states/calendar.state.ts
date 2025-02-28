import { error } from "console";
import Response from "../services/models/response";
import CalendarModel from "../services/models/calendar.day.models";

export interface CalendarState {
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly calendar: CalendarModel | null;
    readonly calendars: CalendarModel[] | null;
    readonly error: string | null;
    readonly errors: { [key: string]: string };
}

const initialState: CalendarState = {
    loading: true,
    loaded: false,
    calendar: null,
    calendars: Array.from({ length: window.settings.YearMonths }, (i, w) => new CalendarModel({ Month: w })), // to show spinners
    error: null,
    errors: {},
};

export const GETTINGCALENDAR  = "GettingCalendar";
export const gettingCalendarAction = () =>
    ({
        type: GETTINGCALENDAR,
    }) as const;

export const GOTCURRENTCALENDAR = "GotCurrentCalendar";
export const gotCurrentCalendarAction = (response: Response<CalendarModel>) =>
    ({
        type: GOTCURRENTCALENDAR,
        calendar: response.data,
        error: response.error,
    }) as const;

export const GOTYEARCALENDAR = "GotYearCalendar";
export const gotYearCalendarAction = (response: Response<CalendarModel[]>) =>
    ({
        type: GOTYEARCALENDAR,
        calendars: response.data,
        error: response.error,
    }) as const;

type CalendarActions =
| ReturnType<typeof gettingCalendarAction>
| ReturnType<typeof gotCurrentCalendarAction>
| ReturnType<typeof gotYearCalendarAction>;

export const calendarReducer: any = (state: CalendarState = initialState, action: CalendarActions) => {
    switch (action.type) {
        case GETTINGCALENDAR:
            return {
                ...state,
                loading: true,
                calendar: initialState.calendar,
                calendars: initialState.calendars,
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
        case GOTYEARCALENDAR:
            return {
                ...state,
                loading: false,
                loaded: action.error ? false : true,
                calendars: action.calendars,
                error: action.error,
            };
        default:
            return state;
    }
};
