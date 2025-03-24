import axios from "axios";
import authHeader from "../services/auth-header";
import { testContainer } from "../helpers/test.helper";
import { CommentData } from "../services/models/comment.model";

const API_URL = "/api/comment/";

export default class commentRepository {
    private testContainer: testContainer | null;

    public constructor(test: testContainer | null) {
        this.testContainer = test;
    }

    private generateHeaders(action: string): any {
        if (this.testContainer && this.testContainer.action === action) {
            return {
                ...authHeader(),
                error: this.testContainer.error,
                errors: JSON.stringify(this.testContainer.errors),
            };
        }
        return authHeader();
    }

    public getAll() {
        let action = "getall";
        return axios.get(`${API_URL}${action}`, { headers: this.generateHeaders(action) });
    }

    public get(id: number) {
        let action = "get";
        return axios.get(`${API_URL}${action}/${id}`, { headers: this.generateHeaders(action) });
    }

    public create(data: CommentData) {
        let action = "create";
        let formData = new FormData();
        let files = data.Files;
        data.Files = null;
        formData.append("modelJson", JSON.stringify(data));
        if (files) {
            for (let file of files) {
                if (file.Blob) {
                    formData.append("files", file.Blob);
                }
            }
        }

        return axios.post(`${API_URL}${action}/`, formData, {
            headers: {
                ...this.generateHeaders(action),
                "Content-Type": "multipart/form-data",
            },
        });
    }

    public update(id: number, data: CommentData) {
        let action = "update";
        let formData = new FormData();
        let files = data.Files;
        let deleteFileNames = data.Files?.filter((e) => e.IsDeleted).map((e) => e.FileName);
        data.Files = null;
        formData.append("modelJson", JSON.stringify({ id, deleteFileNames, ...data }));
        if (files) {
            for (let file of files) {
                if (file.Blob) {
                    formData.append("files", file.Blob);
                }
            }
        }

        return axios.put(`${API_URL}${action}/`, formData, {
            headers: {
                ...this.generateHeaders(action),
                "Content-Type": "multipart/form-data",
            },
        });
    }

    public delete(id: number) {
        let action = "delete";
        return axios.delete(`${API_URL}${action}/${id}`, { headers: this.generateHeaders(action) });
    }
}
