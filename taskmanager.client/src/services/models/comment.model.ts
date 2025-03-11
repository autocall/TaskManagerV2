import BaseModel from "./base.model";

export default class CommentModel extends BaseModel {
    TaskId: number;
    DateTime: Date;
    WorkHours: number;
    Text: string;

    constructor(data?: any) {
        super(data);
        if (data) {
            this.TaskId = data.TaskId;
            this.DateTime = new Date(data.DateTime);
            this.WorkHours = data.WorkHours;
            this.Text = data.Text;
        }
    }
}
