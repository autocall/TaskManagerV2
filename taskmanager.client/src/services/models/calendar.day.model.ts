export default class CalendarDayModel {
    Date: string;
    DayOfWeek: number;
    Day: number;
    Month: number;
    Year: number;
    IsCurrentDay: boolean;

    constructor(data: any) {
        this.Date = data.Date;
        this.DayOfWeek = data.DayOfWeek;
        this.Day = data.Day;
        this.Month = data.Month;
        this.Year = data.Year;
        this.IsCurrentDay = data.IsCurrentDay;
    }
}
