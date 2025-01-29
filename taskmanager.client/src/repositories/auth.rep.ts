import axios from "axios";
import authHeader from "./../services/auth-header";

const API_URL = "/api/account/";

export default class authRepository {
    public register (username: string, email: string, password: string) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password,
        });
    }

    public login (email: string, password: string) {
        return axios.post(API_URL + "signin", {
            email,
            password,
        });
    }

    public identity ()  {
        return axios.get(API_URL + "identity", { headers: authHeader() });
    }    
};