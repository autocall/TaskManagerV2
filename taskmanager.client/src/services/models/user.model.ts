export default class UserModel {
    Id: number;
    CompanyId: number;
    Email: string;
    UserName: string;
    TimeZoneId: string;
    CreatedDateTime: Date;
    ModifiedDateTime: Date;
    IsDeleted: boolean;

    constructor(data?: any) {
        if (data) {
            this.Id = data.Id;
            this.CompanyId = data.CompanyId;
            this.Email = data.Email;
            this.UserName = data.UserName;
            this.TimeZoneId = data.TimeZoneId;
            this.CreatedDateTime = new Date(data.CreatedDateTime);
            this.ModifiedDateTime = new Date(data.ModifiedDateTime);
            this.IsDeleted = data.IsDeleted;
        }
    }
    
    
}
