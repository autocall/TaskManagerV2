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

    CommitHash: string;
    CommitAdditions: number | null;
    CommitDeletions: number | null;

    Files: FileModel[];

    constructor(data?: any, files?: any) {
        super(data);
        if (data) {
            this.TaskId = data.TaskId;
            this.Date = data.Date;
            this.WorkHours = data.WorkHours;
            this.Text = data.Text;

            this.Status = data.TaskStatus;
            this.TaskIndex = data.TaskIndex;
            
            this.CommitHash = data.CommitHash;
            this.CommitAdditions = data.CommitAdditions;
            this.CommitDeletions = data.CommitDeletions;
        }
        if (files) {
            this.Files = files.map((e: any) => new FileModel(e));
        }
    }
    public static create(timeZoneId: string, task: TaskModel): CommentModel {
        let model = new CommentModel(new CommentData());
        model.Date = stringExtension.dateToISO(moment().tz(timeZoneId));
        model.TaskId = task.Id;
        model.Status = Math.max(task.Status, TaskStatusEnum.InProgress);
        model.TaskIndex = task.Index;
        model.Files = [];
        return model;
    }
}

export interface ICommentData {
    TaskId: number;
    Date: string;
    WorkHours: number;
    Text: string;
    CommitHash: string;
    Files: FileModel[] | null;
}

export class CommentData implements ICommentData {
    TaskId: number;
    Date: string;
    WorkHours: number;
    Text: string;
    Status: TaskStatusEnum | null;
    CommitHash: string;
    CommitAdditions: number | null;
    CommitDeletions: number | null;
    Files: FileModel[] | null;

    constructor(data: any = null) {
        if (!data) {
            //this.TaskId = skipped;
            //this.Date = skipped;
            this.WorkHours = 0;
            this.Text = "";
            this.CommitHash = "";
            //this.Status = skipped;
            this.Files = [];
        } else {
            this.TaskId = data.TaskId;
            this.Date = data.Date;
            this.WorkHours = data.WorkHours;
            this.Text = data.Text;
            this.Status = data.Status;
            this.CommitHash = data.CommitHash ?? '';
            this.CommitAdditions = data.CommitAdditions;
            this.CommitDeletions = data.CommitDeletions;
            this.Files = data.Files;
        }
    }
}
