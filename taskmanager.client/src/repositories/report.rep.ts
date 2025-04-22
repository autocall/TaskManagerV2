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

    public getByDate(date: string) {
        let action = "getByDate";
        let query = { date };
        return axios.get(`${API_URL}${action}?` + new URLSearchParams(query).toString(), { headers: this.generateHeaders(action) });
    }

    public getByRange(dateFrom: string, dateTo: string) {
        let action = "getByRange";
        let query = { dateFrom, dateTo };
        return axios.get(`${API_URL}${action}?` + new URLSearchParams(query).toString(), { headers: this.generateHeaders(action) });
    }
}
