import axios from "axios";
import authHeader from "./../services/auth-header";
import { testContainer } from "../helpers/test.helper";
import { TaskColumnEnum } from "../enums/task.column.enum";

const API_URL = "/api/project/";

export default class projectRepository {
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

    public create(name: string, defaultColumn: TaskColumnEnum, gitHubRepo: string) {
        let action = "create";
        return axios.post(
            `${API_URL}${action}/`,
            {
                name,
                defaultColumn,
                gitHubRepo,
            },
            { headers: this.generateHeaders(action) },
        );
    }

    public update(id: number, name: string, defaultColumn: TaskColumnEnum, gitHubRepo: string) {
        let action = "update";
        return axios.put(
            `${API_URL}${action}/`,
            {
                id,
                name,
                defaultColumn,
                gitHubRepo,
            },
            { headers: this.generateHeaders(action) },
        );
    }

    public delete(id: number) {
        let action = "delete";
        return axios.delete(`${API_URL}${action}/${id}`, { headers: this.generateHeaders(action) });
    }
}
