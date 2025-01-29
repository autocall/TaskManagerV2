import moment from "moment";

export default class BaseModel {
    EntityId: string;
    CreatedDate: moment.Moment;
    ModifiedDate: moment.Moment;

    constructor(data?: any) {
        if (data) {
            this.EntityId = data.EntityId;
            this.CreatedDate = moment(data.CreatedDate);
            this.ModifiedDate = moment(data.ModifiedDate);
        }
    }
}
