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
}

export class ExtendedEventData extends EventData implements IExtendedEventData {
    get DateString(): string {
        return stringExtension.dateToString(this.Date);
    }
    set DateString(value: string) {
        this.Date = new Date(value);
    }

    constructor(data: any = null) {
        super(data);
    }

    static fromDate(date: Date): ExtendedEventData {
        let data = new ExtendedEventData();
        data.DateString = stringExtension.dateToString(date);
        return data;
    }
}
