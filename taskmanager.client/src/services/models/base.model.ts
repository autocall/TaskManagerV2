import moment from "moment";
import UserModel from "./user.model";

export default class BaseModel {
    Id: number;
    CreatedDateTime: Date;
    ModifiedDateTime: Date;

    CreatedById: number;
    ModifiedById: number;

    CreatedUser: UserModel | null;
    ModifiedUser: UserModel | null;

    constructor(data?: any) {
        if (data) {
            this.Id = data.Id;
            this.CreatedDateTime = new Date(data.CreatedDateTime);
            this.ModifiedDateTime = new Date(data.ModifiedDateTime);
            this.CreatedById = data.CreatedById;
            this.ModifiedById = data.ModifiedById;
        }
    }
}
