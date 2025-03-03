import { TimeZoneModel } from "./timezone.model";

export default class IdentityModel {
    public Id: string;
    public UserName: string;
    public Email: string;
    public TimeZone: TimeZoneModel;
    public Roles: string;

    constructor(data: any) {
        this.Id = data.Id;
        this.UserName = data.UserName;
        this.Email = data.Email;
        this.TimeZone = new TimeZoneModel(data.TimeZone);
        this.Roles = data.Roles;
    }
}
