import { testContainer } from "../helpers/test.helper";
import calendarRepository from "../repositories/calendar.rep";
import CalendarModel from "./models/calendar.day.models";
import Response from "./models/response";

export default class calendarService {
    private rep: calendarRepository;

    constructor(test: testContainer | null) {
        this.rep = new calendarRepository(test);
    }

    public static getFirstDayOfWeek() {
        let opt = new Intl.DateTimeFormat(navigator.language, { weekday: "long" }).resolvedOptions();
        return (opt as any).firstDay || 0;
    }

    public getCurrent(): Promise<Response<CalendarModel>> {
        return this.rep
            .getCurrent(calendarService.getFirstDayOfWeek())
            .then((response) => {
                let model = new CalendarModel(response.data);
                return Response.success<CalendarModel>(model);
            })
            .catch((exception) => {
                return Response.fail<CalendarModel>(exception);
            });
    }

    public getYear(): Promise<Response<CalendarModel[]>> {
        return this.rep
            .getYear(calendarService.getFirstDayOfWeek())
            .then((response) => {
                let models = response.data.map((x: any) => new CalendarModel(x));
                return Response.success<CalendarModel[]>(models);
            })
            .catch((exception) => {
                return Response.fail<CalendarModel[]>(exception);
            });
    }
}
