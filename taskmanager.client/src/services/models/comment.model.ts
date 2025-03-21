import moment from "moment";
import { TaskStatusEnum } from "../../enums/task.status.enum";
import stringExtension from "../../extensions/string.extension";
import BaseModel from "./base.model";
import FileModel from "./file.model";
import TaskModel from "./task.model";

export default class CommentModel extends BaseModel implements ICommentData {
    TaskId: number;
    Date: string;
    WorkHours: number;
    Text: string;

    Status: TaskStatusEnum | null;
    TaskIndex: number | null;

    Files: FileModel[];

    constructor(data?: any) {
        super(data);
        if (data) {
            this.TaskId = data.TaskId;
            this.Date = data.Date;
            this.WorkHours = data.WorkHours;
            this.Text = data.Text;

            this.Status = data.TaskStatus;
            this.TaskIndex = data.TaskIndex;
        }
    }
    public static create(timeZoneId: string, task: TaskModel): CommentModel {
        let model = new CommentModel(new CommentData());
        model.Date = stringExtension.dateToISO(moment().tz(timeZoneId));
        model.TaskId = task.Id;
        model.Status = Math.max(task.Status, TaskStatusEnum.InProgress);
        model.TaskIndex = task.Index;
        return model;
    }
}

export interface ICommentData {
    TaskId: number;
    Date: string;
    WorkHours: number;
    Text: string;
}

export class CommentData implements ICommentData {
    TaskId: number;
    Date: string;
    WorkHours: number;
    Text: string;
    Status: TaskStatusEnum | null;

    constructor(data: any = null) {
        if (!data) {
            //this.TaskId = skipped;
            //this.Date = skipped;
            this.WorkHours = 0;
            this.Text = "";
            //this.Status = skipped;
        } else {
            this.TaskId = data.TaskId;
            this.Date = data.Date;
            this.WorkHours = data.WorkHours;
            this.Text = data.Text;
            this.Status = data.Status;
        }
    }
}
