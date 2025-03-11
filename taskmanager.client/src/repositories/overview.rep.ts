import axios from "axios";
import authHeader from "../services/auth-header";
import { testContainer } from "../helpers/test.helper";

const API_URL = "/api/overview/";

export default class overviewRepository {
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

    public get() {
        let action = "get";
        return axios.get(`${API_URL}${action}`, { headers: this.generateHeaders(action) });
    }
}
