import colorExtension from "../extensions/color.extension";
import { testContainer } from "../helpers/test.helper";
import categoryRepository from "../repositories/category.rep";
import CategoryModel from "./models/category.model";
import Response from "./models/response";

export default class categoryService {
    private rep: categoryRepository;

    constructor(test: testContainer | null) {
        this.rep = new categoryRepository(test);
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
                let model = new CategoryModel(response.data);
                return Response.success<CategoryModel>(model);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public create(name: string, color: string) {
        return this.rep
            .create(name, colorExtension.toNumber(color))
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public update(id: number, name: string, color: string) {
        return this.rep
            .update(id, name, colorExtension.toNumber(color))
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public updateOrder(id: number, order: -1 | 1) {
        return this.rep
            .updateOrder(id, order)
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
