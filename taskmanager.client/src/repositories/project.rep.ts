import axios from "axios";
import authHeader from "./../services/auth-header";

const API_URL = "/api/project/";

export default class projectRepository {
    public getAll () {
        return axios.get(`${API_URL}getall`, { headers: authHeader() });
    }
    
    public get (id: number) {
        return axios.get(`${API_URL}get/${id}`, { headers: authHeader() });
    }

    public create (name: string) {
        return axios.post(`${API_URL}/create`, {
            name,
        }, { headers: authHeader() });
    }

    public update (id: number, name: string) {
        return axios.put(`${API_URL}/update`, {
            id,
            name,
        }, { headers: authHeader() });
    }

    public delete (id: number) {
        return axios.delete(`${API_URL}/delete/${id}`, { headers: authHeader() });
    }

    public deleteTest (id: number) {
        return axios.delete(`${API_URL}/deletetest/${id}`, { headers: authHeader() });
    }
};