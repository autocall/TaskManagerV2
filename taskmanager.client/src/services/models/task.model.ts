import { TaskColumnEnum } from "../../enums/task.column.enum";
import { TaskKindEnum } from "../../enums/task.kind.enum";
import { TaskStatusEnum } from "../../enums/task.status.enum";
import BaseModel from "./base.model";
import CommentModel from "./comment.model";
import FileModel from "./file.model";
import ProjectModel from "./project.model";

export default class TaskModel extends BaseModel implements ITaskData {
    Index: number | null;
    Title: string;
    Description: string;
    ProjectId: number;
    CategoryId: number;
    Column: TaskColumnEnum;
    Kind: TaskKindEnum | null;
    Status: TaskStatusEnum;
    WorkHours: number;
    CommentsCount: number;

    Project: ProjectModel | null;
    Comments: CommentModel[];

    Files: FileModel[];

    constructor(data?: any, files?: any) {
        super(data);
        if (data) {
            this.Index = data.Index;
            this.Column = data.Column;
            this.Title = data.Title;
            this.Description = data.Description;
            this.ProjectId = data.ProjectId;
            this.CategoryId = data.CategoryId;
            this.Column = data.Column;
            this.Kind = data.Kind;
            this.Status = data.Status;
            this.WorkHours = data.WorkHours;
            this.CommentsCount = data.CommentsCount;
        }
        if (files) {
            this.Files = files.map((e: any) => new FileModel(e));
        } else {
            this.Files = [];
        }
    }
}

export interface ITaskData {
    Index: number | null;
    Title: string;
    Description: string;
    ProjectId: number | null;
    CategoryId: number | null;
    Column: TaskColumnEnum;
    Kind: TaskKindEnum | null;
    Status: TaskStatusEnum | null;
    Files: FileModel[] | null;
}

export class TaskData implements ITaskData {
    Index: number | null;
    Title: string;
    Description: string;
    ProjectId: number | null;
    CategoryId: number | null;
    Column: TaskColumnEnum;
    Kind: TaskKindEnum | null;
    Status: TaskStatusEnum | null;
    Files: FileModel[] | null;

    constructor(data: any = null) {
        if (!data) {
            this.Index = null;
            this.Title = "";
            this.Description = "";
            this.Column = TaskColumnEnum.First;
            this.Kind = null;
            this.Status = null;
            this.ProjectId = null;
            this.CategoryId = null;
            this.Files = [];
        } else {
            this.Index = data.Index;
            this.Title = data.Title;
            this.Description = data.Description;
            this.Column = data.Column;
            this.Kind = data.Kind;
            this.Status = data.Status;
            this.ProjectId = data.ProjectId;
            this.CategoryId = data.CategoryId;
            this.Files = data.Files;
        }
    }
}