import { TimeZoneModel } from "./timezone.model";

export default class IdentityModel {
    public Id: string;
    public UserName: string;
    public Email: string;
    public TimeZone: TimeZoneModel;
    public Roles: string;
    public GitHubOwner: string;
    public GitHubToken: string;

    constructor(data: any) {
        this.Id = data.Id;
        this.UserName = data.UserName;
        this.Email = data.Email;
        this.TimeZone = new TimeZoneModel(data.TimeZone);
        this.Roles = data.Roles;
        this.GitHubOwner = data.GitHubOwner;
        this.GitHubToken = data.GitHubToken;
    }
}
