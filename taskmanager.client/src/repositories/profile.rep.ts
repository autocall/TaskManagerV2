import axios from "axios";
import authHeader from "../services/auth-header";
import { testContainer } from "../helpers/test.helper";

const API_URL = "/api/profile/";

export default class profileRepository {
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

    public getTimeZones() {
        let action = "gettimezones";
        return axios.get(API_URL + action, { headers: this.generateHeaders(action) });
    }

    public setTimeZoneId(timeZoneId: string) {
        let action = "settimezone";
        return axios.put(
            API_URL + action,
            {
                timeZoneId: timeZoneId,
            },
            { headers: this.generateHeaders(action) },
        );
    }

    public getGitHub() {
        let action = "getgithub1";
        return axios.get(API_URL + action, { headers: this.generateHeaders(action) });
    }

    public setGitHub(owner: string, token: string) {
        let action = "setgithub";
        return axios.put(
            API_URL + action,
            {
                owner: owner,
                token: token,
            },
            { headers: this.generateHeaders(action) },
        );
    }
}
