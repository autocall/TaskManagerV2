import profileRepository from "../repositories/profile.rep";
import Response from "./models/response";
import { testContainer } from "../helpers/test.helper";
import { TimeZoneModel } from "./models/timezone.model";

export default class profileService {
    private rep: profileRepository;

    constructor(test: testContainer | null = null) {
        this.rep = new profileRepository(test);
    }

    public getTimeZones(): Promise<Response<{ TimeZones: TimeZoneModel[]; TimeZoneId: string }>> {
        return this.rep
            .getTimeZones()
            .then((response) => {
                let models = (response.data.TimeZones as any[]).map((e: any) => new TimeZoneModel(e));
                let timeZoneId = response.data.TimeZoneId;
                return Response.success<{ TimeZones: TimeZoneModel[]; TimeZoneId: string }>({ TimeZones: models, TimeZoneId: timeZoneId });
            })
            .catch((exception) => {
                return Response.fail<{ TimeZones: TimeZoneModel[]; TimeZoneId: string }>(exception);
            });
    }

    public setTimeZoneId(timeZoneId: string): Promise<Response<any>> {
        return this.rep
            .setTimeZoneId(timeZoneId)
            .then((response) => {
                localStorage.setItem("token", response.data.Token);
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }
}
