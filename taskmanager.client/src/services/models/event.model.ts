import { EventRepeatEnum } from "../../enums/event.repeat.enum";
import { EventTypeEnum } from "../../enums/event.type.enum";
import stringExtension from "../../extensions/string.extension";
import BaseModel from "./base.model";

export default class EventModel extends BaseModel implements IEventData {
    Date: string;
    Name: string;
    Description: string;

    RepeatType: EventRepeatEnum;
    RepeatValue: number;
    Type: EventTypeEnum;

    constructor(data?: any) {
        super(data);
        if (data) {
            this.Date = data.Date;
            this.Name = data.Name;
            this.Description = data.Description;

            this.RepeatType = data.RepeatType;
            this.RepeatValue = data.RepeatValue;

            this.Type = data.Type;
        }
    }
}

export interface IEventData {
    Date: string;
    Name: string;
    Description: string;

    RepeatType: EventRepeatEnum;
    RepeatValue: number;

    Type: EventTypeEnum;
}

export class EventData implements IEventData {
    Date: string;
    Name: string;
    Description: string;

    RepeatType: EventRepeatEnum;
    RepeatValue: number;

    Type: EventTypeEnum;

    constructor(data: any = null) {
        if (!data) {
            this.Date = stringExtension.dateToISO(new Date());
            this.Name = "";
            this.Description = "";

            this.RepeatType = EventRepeatEnum.Default;
            this.RepeatValue = 0;

            this.Type = EventTypeEnum.Default;
        } else {
            this.Date = data.Date;
            this.Name = data.Name;
            this.Description = data.Description;

            this.RepeatType = data.RepeatType;
            this.RepeatValue = data.RepeatValue;

            this.Type = data.Type;
        }
    }

    static defaultWithDate(date: Date): EventData {
        let data = new EventData();
        data.Date = stringExtension.dateToISO(date);
        return data;
    }
}