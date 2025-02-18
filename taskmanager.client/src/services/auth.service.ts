import { jwtDecode } from "jwt-decode";
import IJwt from "../types/jwt.type";
import authRepository from "./../repositories/auth.rep";
import Response from "./models/response";
import { testContainer } from "../helpers/test.helper";

export default class authService {
    private rep: authRepository;

    constructor(test: testContainer | null) {
        this.rep = new authRepository(test);
    }

    public register(username: string, email: string, password: string) {
        return this.rep
            .register(username, email, password)
            .then((response) => {
                localStorage.setItem("token", response.data.Token);
                return Response.success<string>(response.data.Token);
            })
            .catch((exception) => {
                return Response.fail<string>(exception);
            });
    }

    public login(email: string, password: string): Promise<Response<string>> {
        return this.rep
            .login(email, password)
            .then((response) => {
                localStorage.setItem("token", response.data.Token);
                return Response.success<string>(response.data.Token);
            })
            .catch((exception) => {
                return Response.fail<string>(exception);
            });
    }

    public identity(): Promise<Response<any>> {
        return this.rep
            .identity()
            .then((response) => {
                return Response.success<any>(response.data.Token);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public logout() {
        localStorage.removeItem("token");
    }

    public getCurrentUser(): IJwt | null {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            //console.log(decoded);
            // Object { id: "763a5057-b1c0-4dca-b03e-08dcf980e6aa", unique_name: "test", email: "test@test.com", nbf: 1730365461, exp: 1730369061, iat: 1730365461 }
            if (decoded) return decoded as IJwt;
        }
        return null;
    }
}
