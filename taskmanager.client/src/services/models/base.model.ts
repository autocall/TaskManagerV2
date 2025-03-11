import moment from "moment";
import UserModel from "./user.model";

export default class BaseModel {
    Id: number;
    CreatedDateTime: moment.Moment;
    ModifiedDateTime: moment.Moment;

    CreatedById: number;
    ModifiedById: number;

    CreatedUser: UserModel | null;
    ModifiedUser: UserModel | null;

    constructor(data?: any) {
        if (data) {
            this.Id = data.Id;
            this.CreatedDateTime = moment(data.CreatedDateTime);
            this.ModifiedDateTime = moment(data.ModifiedDateTime);
            this.CreatedById = data.CreatedById;
            this.ModifiedById = data.ModifiedById;
        }
    }
}
