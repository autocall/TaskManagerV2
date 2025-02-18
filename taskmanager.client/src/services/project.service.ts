import { testContainer } from "../helpers/test.helper";
import projectRepository from "../repositories/project.rep";
import ProjectModel from "./models/project.model";
import Response from "./models/response";

export default class projectService {
    private rep: projectRepository;
    
        constructor(test: testContainer | null) {
            this.rep = new projectRepository(test);
        }

    public getAll(): Promise<Response<ProjectModel[]>> {
        return this.rep
            .getAll()
            .then((response) => {
                let models = (response.data as any[]).map((e: any) => new ProjectModel(e));
                return Response.success<ProjectModel[]>(models);
            })
            .catch((exception) => {
                return Response.fail<ProjectModel[]>(exception);
            });
    }

    public get(id: number) {
        return this.rep
            .get(id)
            .then((response) => {
                let model = new ProjectModel(response.data);
                return Response.success<ProjectModel>(model);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public create(name: string) {
        return this.rep
            .create(name)
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public update(id: number, name: string) {
        return this.rep
            .update(id, name)
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
