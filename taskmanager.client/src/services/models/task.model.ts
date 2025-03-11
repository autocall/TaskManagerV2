import { TaskColumnEnum } from "../../enums/task.column.enum";
import { TaskKindEnum } from "../../enums/task.kind.enum";
import { TaskStatusEnum } from "../../enums/task.status.enum";
import BaseModel from "./base.model";
import CommentModel from "./comment.model";
    
export default class TaskModel extends BaseModel {
    Title: string;
    Description: string;
    ProjectId: number;
    CategoryId: number;
    Column: TaskColumnEnum;
    Kind: TaskKindEnum;
    Status: TaskStatusEnum;
    WorkHours: number;

    Comments: CommentModel[];

    constructor(data?: any) {
        super(data);
        if (data) {
            this.Title = data.Title;
            this.Description = data.Description;
            this.ProjectId = data.ProjectId;
            this.CategoryId = data.CategoryId;
            this.Column = data.Column;
            this.Kind = data.Kind;
            this.Status = data.Status;
            this.WorkHours = data.WorkHours;

            this.Comments = data.Comments?.map((c: any) => new CommentModel(c));
        }
    }
}
