import stringExtension from "../../extensions/string.extension";
import BaseModel from "./base.model";

export default class EventModel extends BaseModel implements IEventData {
    Date: Date;
    Name: string;
    Description: string;

    RepeatType: number;
    RepeatValue: number;
    Birthday: boolean;
    Holiday: boolean;

    constructor(data?: any) {
        super(data);
        if (data) {
            this.Date = data.Date;
            this.Name = data.Name;
            this.Description = data.Description;

            this.RepeatType = data.RepeatType;
            this.RepeatValue = data.RepeatValue;

            this.Birthday = data.Birthday;
            this.Holiday = data.Holiday;
        }
    }
}

export interface IEventData {
    Date: Date;
    Name: string;
    Description: string;

    RepeatType: number;
    RepeatValue: number;
    Birthday: boolean;
    Holiday: boolean;
}

export interface IExtendedEventData extends IEventData {
    DateString: string;
}

export class EventData implements IEventData {
    Date: Date;
    Name: string;
    Description: string;

    RepeatType: number;
    RepeatValue: number;
    Birthday: boolean;
    Holiday: boolean;

    constructor(data: any = null) {
        if (!data) {
            this.Date = new Date();
            this.Name = "";
            this.Description = "";

            this.RepeatType = 0;
            this.RepeatValue = 0;

            this.Birthday = false;
            this.Holiday = false;
        } else {
            this.Date = data.Date;
            this.Name = data.Name;
            this.Description = data.Description;

            this.RepeatType = data.RepeatType;
            this.RepeatValue = data.RepeatValue;

            this.Birthday = data.Birthday;
            this.Holiday = data.Holiday;
        }
    }

    static defaultWithDate(date: Date): EventData {
        let data = new EventData();
        data.Date = date;
        return data;
    }
}

export class ExtendedEventData extends EventData implements IExtendedEventData {
    DateString: string;

    constructor(data: any = null) {
        super(data);
        if (data) {
            this.DateString = data.DateString;
        }
    }
}

export class EventDataFactory {
    /// Adds a DateString from Date
    static toExtend(data: IEventData): IExtendedEventData {
        let event = new ExtendedEventData(data);
        event.DateString = stringExtension.dateToString(event.Date);
        return event;
    }

    /// Removes DateString and converts to Date
    static fromExtend(data: IExtendedEventData) : IEventData {
        let event = new EventData(data);
        event.Date = new Date(data.DateString);
        return event;
    }
}
