import IdentityModel from "./src/services/models/identity.model";

export {};

declare global {
    interface Window {
        settings: {
            CurrentCalendarWeeks: number;
            YearMonths: number;
        };
        identity: IdentityModel;
    }
}