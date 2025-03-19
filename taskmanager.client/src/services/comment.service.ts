import { testContainer } from "../helpers/test.helper";
import commentRepository from "../repositories/comment.rep";
import CommentModel, { CommentData } from "./models/comment.model";
import Response from "./models/response";

export default class commentService {
    private rep: commentRepository;
    
        constructor(test: testContainer | null) {
            this.rep = new commentRepository(test);
        }

    public get(id: number) {
        return this.rep
            .get(id)
            .then((response) => {
                let model = new CommentModel(response.data);
                return Response.success<CommentModel>(model);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public create(data: CommentData) {
        return this.rep
            .create(data)
            .then((response) => {
                return Response.success<any>(response.data);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public update(id: number, data: CommentData) {
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
}
