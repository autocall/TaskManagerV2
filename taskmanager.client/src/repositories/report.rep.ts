import axios from "axios";
import authHeader from "../services/auth-header";
import { testContainer } from "../helpers/test.helper";

const API_URL = "/api/report/";

export default class reportRepository {
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

    public get(date: string) {
        let action = "get";
        let query = {};
        if (date) {
            query = { ...query, Date: date };
        }
        return axios.get(`${API_URL}${action}?` + new URLSearchParams(query).toString(), { headers: this.generateHeaders(action) });
    }
}
