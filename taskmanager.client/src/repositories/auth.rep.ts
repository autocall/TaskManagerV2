import axios from "axios";
import authHeader from "./../services/auth-header";

const API_URL = "/api/account/";

export default class authRepository {
    private errorHeader: string | null = null;
    private errorsHeader: { [key: string]: string } = {};

    public addErrorHeader(error: string) {
        this.errorHeader = error;
    }

    public addErrorsHeader(field: string, error: string) {
        this.errorsHeader[field] = error;
    }
    
    private generateHeaders(): { error: string | null; errors: string | null } {
        let headers: { error: string | null; errors: string | null } = {
            ...authHeader(),
            error: null,
            errors: null,
        };
        if (this.errorHeader) {
            headers = { ...headers, error: this.errorHeader };
        }
        if (Object.keys(this.errorsHeader).length > 0) {
            headers = { ...headers, errors: JSON.stringify(this.errorsHeader) };
        }
        return headers;
    }

    public register (username: string, email: string, password: string) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password,
        }, { headers: this.generateHeaders() });
    }

    public login (email: string, password: string) {
        return axios.post(API_URL + "signin", {
            email,
            password,
        }, { headers: this.generateHeaders() });
    }

    public identity ()  {
        return axios.get(API_URL + "identity", { headers: authHeader() });
    }    
};