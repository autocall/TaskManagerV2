import { testContainer } from "../helpers/test.helper";
import calendarRepository from "../repositories/calendar.rep";
import CalendarDayModel from "./models/calendar.day.model";
import Response from "./models/response";

export default class calendarService {
    private rep: calendarRepository;

    constructor(test: testContainer | null) {
        this.rep = new calendarRepository(test);
    }

    public getCurrent(): Promise<Response<CalendarDayModel[]>> {
        return this.rep
            .getCurrent()
            .then((response) => {
                let models = (response.data as any[]).map((e: any) => new CalendarDayModel(e));
                return Response.success<CalendarDayModel[]>(models);
            })
            .catch((exception) => {
                return Response.fail<CalendarDayModel[]>(exception);
            });
    }
}
