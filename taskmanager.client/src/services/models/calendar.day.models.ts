import moment from "moment";
import { EventTypeEnum } from "../../enums/event.type.enum";
import calendarService from "../calendar.service";

export class CalendarDayModel {
    Date: Date;
    DayOfWeek: number;
    Day: number;
    Month: number;
    Year: number;
    IsCurrentDay: boolean;

    Events: CalendarEventModel[];

    constructor(data: any) {
        this.Date = new Date(data.Date);
        this.DayOfWeek = data.DayOfWeek;
        this.Day = data.Day;
        this.Month = data.Month;
        this.Year = data.Year;
        this.IsCurrentDay = data.IsCurrentDay;

        this.Events = data.Events.map((e: any) => new CalendarEventModel(e));
    }
}

export class CalendarEventModel {
    Id: number;
    Name: string;
    Description: string;
    Date: Date;
    RepeatType: number;
    RepeatValue: number;
    Type: EventTypeEnum;

    constructor(data: any) {
        this.Id = data.Id;
        this.Name = data.Name;
        this.Description = data.Description;
        this.Date = new Date(data.Date);
        this.RepeatType = data.RepeatType;
        this.RepeatValue = data.RepeatValue;
        this.Type = data.Type;
    }
}

export default class CalendarModel {
    Days: CalendarDayModel[];
    Month: number;
    Year: number;
    MonthName: string;
    WeekNames: string[];

    constructor(data: any) {
        this.Days = data.Days.map((e: any) => new CalendarDayModel(e));
        this.Month = data.Month;
        this.Year = data.Year;

        let firstDayOfWeek = calendarService.getFirstDayOfWeek();
        this.MonthName = moment()
            .month(this.Month - 1)
            .format("MMMM");
        this.WeekNames = Array.from(
            { length: 7 },
            (_, w) =>
                moment()
                    .weekday(w + firstDayOfWeek)
                    .format("dd"),
        );
    }
}
