export {};

declare global {
    interface Window {
        settings: {
            CurrentCalendarWeeks: number;
            YearMonths: number;
        };
    }
}