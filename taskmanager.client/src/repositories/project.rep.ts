import axios from "axios";
import authHeader from "./../services/auth-header";

const API_URL = "/api/project/";

export default class projectRepository {
    private errorHeader: string | null = null;
    private errorsHeader: { [key: string]: string } = {};

    public addErrorHeader(error: string) {
        this.errorHeader = error;
    }

    public addErrorsHeader(field: string, error: string) {
        this.errorsHeader[field] = error;
    }

    private generateHeaders(): { Authorization: string; error: string | null; errors: string | null } {
        let headers: { Authorization: string; error: string | null; errors: string | null } = {
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

    public getAll() {
        return axios.get(`${API_URL}getall`, { headers: this.generateHeaders() });
    }

    public get(id: number) {
        return axios.get(`${API_URL}get/${id}`, { headers: this.generateHeaders() });
    }

    public create(name: string) {
        return axios.post(
            `${API_URL}create`,
            {
                name,
            },
            { headers: this.generateHeaders() },
        );
    }

    public update(id: number, name: string) {
        return axios.put(
            `${API_URL}update`,
            {
                id,
                name,
            },
            { headers: this.generateHeaders() },
        );
    }

    public delete(id: number) {
        return axios.delete(`${API_URL}delete/${id}`, { headers: this.generateHeaders() });
    }
}
