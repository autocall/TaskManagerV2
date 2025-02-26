import { testContainer } from "../helpers/test.helper";
import eventRepository from "../repositories/event.rep";
import EventModel, { EventData } from "./models/event.model";
import Response from "./models/response";

export default class eventService {
    private rep: eventRepository;

    constructor(test: testContainer | null) {
        this.rep = new eventRepository(test);
    }

    public getAll(): Promise<Response<EventModel[]>> {
        return this.rep
            .getAll()
            .then((response) => {
                let models = (response.data as any[]).map((e: any) => new EventModel(e));
                return Response.success<EventModel[]>(models);
            })
            .catch((exception) => {
                return Response.fail<EventModel[]>(exception);
            });
    }

    public get(id: number) {
        return this.rep
            .get(id)
            .then((response) => {
                let model = new EventModel(response.data);
                return Response.success<EventModel>(model);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public create(data: EventData) {
        return this.rep
            .create(data)
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public update(id: number, data: EventData) {
        return this.rep
            .update(id, data)
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public completeEvent(eventId: number) {
        return this.rep
            .completeEvent(eventId)
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public delete(id: number) {
        return this.rep
            .delete(id)
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }
}
