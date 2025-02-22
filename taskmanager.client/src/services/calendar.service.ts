import { testContainer } from "../helpers/test.helper";
import calendarRepository from "../repositories/calendar.rep";
import CalendarModel from "./models/calendar.day.models";
import Response from "./models/response";

export default class calendarService {
    private rep: calendarRepository;

    constructor(test: testContainer | null) {
        this.rep = new calendarRepository(test);
    }

    public getCurrent(): Promise<Response<CalendarModel>> {
        return this.rep
            .getCurrent()
            .then((response) => {
                let model = new CalendarModel(response.data);
                return Response.success<CalendarModel>(model);
            })
            .catch((exception) => {
                return Response.fail<CalendarModel>(exception);
            });
    }
}
