import moment from "moment";

export default class BaseModel {
    Id: number;
    CreatedDateTime: moment.Moment;
    ModifiedDateTime: moment.Moment;

    constructor(data?: any) {
        if (data) {
            this.Id = data.Id;
            this.CreatedDateTime = moment(data.CreatedDateTime);
            this.ModifiedDateTime = moment(data.ModifiedDateTime);
        }
    }
}
