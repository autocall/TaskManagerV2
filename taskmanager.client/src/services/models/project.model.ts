import { TaskColumnEnum } from "../../enums/task.column.enum";
import BaseModel from "./base.model";

export default class ProjectModel extends BaseModel {
    Name: string;
    DefaultColumn: TaskColumnEnum;

    constructor(data?: any) {
        super(data);
        if (data) {
            this.Name = data.Name;
            this.DefaultColumn = data.DefaultColumn;
        }
    }
}
