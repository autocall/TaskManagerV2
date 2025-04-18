import { testContainer } from "../helpers/test.helper";
import taskRepository from "../repositories/task.rep";
import TaskModel, { TaskData } from "./models/task.model";
import Response from "./models/response";
import CategoryModel from "./models/category.model";

export default class taskService {
    private rep: taskRepository;
    
        constructor(test: testContainer | null) {
            this.rep = new taskRepository(test);
        }

    public getAll(): Promise<Response<CategoryModel[]>> {
        return this.rep
            .getAll()
            .then((response) => {
                let models = (response.data as any[]).map((e: any) => new CategoryModel(e));
                return Response.success<CategoryModel[]>(models);
            })
            .catch((exception) => {
                return Response.fail<CategoryModel[]>(exception);
            });
    }

    public get(id: number) {
        return this.rep
            .get(id)
            .then((response) => {
                let model = new TaskModel(response.data.task, response.data.files);
                return Response.success<TaskModel>(model);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public create(data: TaskData) {
        return this.rep
            .create(data)
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public update(id: number, data: TaskData) {
        return this.rep
            .update(id, data)
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
    
    public up(id: number) {
        return this.rep
            .up(id)
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }
    
    public down(id: number) {
        return this.rep
            .down(id)
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }
}
