import { ReportModel } from "../services/models/report.models";
import Response from "../services/models/response";

export interface ReportState {
    readonly submitting: boolean;
    readonly loading: boolean;
    readonly loaded: boolean;
    readonly report: ReportModel | null;
    readonly error: string | null;
}

const initialState: ReportState = {
    loading: true, // prevents reinitialization of fields
    loaded: false,
    report: null,
    submitting: false,
    error: null,
};

export const GETTINGREPORT = "GettingReport";
export const gettingReportAction = () =>
    ({
        type: GETTINGREPORT,
    }) as const;

export const GOTREPORT = "GotReport";
export const gotReportAction = (response: Response<ReportModel>) =>
    ({
        type: GOTREPORT,
        report: response.data ?? initialState.report,
        error: response.error ?? initialState.error,
    }) as const;

type ReportActions =
    | ReturnType<typeof gettingReportAction>
    | ReturnType<typeof gotReportAction>;

export const reportReducer: any = (state: ReportState = initialState, action: ReportActions) => {
    switch (action.type) {
        case GETTINGREPORT:
            return {
                ...state,
                ...action,
                loading: true,
                loaded: false,
            };
        case GOTREPORT:
            return {
                ...state,
                ...action,
                loading: false,
                loaded: action.error ? false : true,
            };
        default:
            return state;
    }
};
