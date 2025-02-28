import axios from "axios";
import authHeader from "./../services/auth-header";
import { testContainer } from "../helpers/test.helper";

const API_URL = "/api/calendar/";

export default class calendarRepository {
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

    public getCurrent(firstDayOfWeek: number): Promise<any> {
        let action = "getcurrent";
        return axios.get(`${API_URL}${action}?firstDayOfWeek=${firstDayOfWeek}`, { headers: this.generateHeaders(action) });
    }

    public getYear(firstDayOfWeek: number): Promise<any> {
        let action = "getyear";
        return axios.get(`${API_URL}${action}?firstDayOfWeek=${firstDayOfWeek}`, { headers: this.generateHeaders(action) });
    }
}
