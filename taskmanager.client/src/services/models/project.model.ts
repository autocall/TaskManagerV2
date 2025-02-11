import BaseModel from "./base.model";

export default class ProjectModel extends BaseModel {
    Name: string;

    constructor(data?: any) {
        super(data);
        if (data) {
            this.Name = data.Name;
        }
    }
}
