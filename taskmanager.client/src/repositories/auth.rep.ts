import axios from "axios";
import authHeader from "./../services/auth-header";
import { testContainer } from "../helpers/test.helper";

const API_URL = "/api/account/";

export default class authRepository {
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

    public register(username: string, email: string, password: string) {
        let action = "signup";
        return axios.post(
            API_URL + action,
            {
                username,
                email,
                password,
            },
            { headers: this.generateHeaders(action) },
        );
    }

    public login(email: string, password: string) {
        let action = "signin";
        return axios.post(
            API_URL + action,
            {
                email,
                password,
            },
            { headers: this.generateHeaders(action) },
        );
    }

    public identity() {
        let action = "identity";
        return axios.get(API_URL + action, { headers: this.generateHeaders(action) });
    }
}
