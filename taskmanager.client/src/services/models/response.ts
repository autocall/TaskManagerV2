export default class Response<T> {
    success: boolean;
    status: number;
    data: T;
    errors: { [key: string]: string };
    error: string;

    private constructor() {}

    static success<T>(data: T): Response<T> {
        const response = new Response<T>();
        response.success = true;
        response.status = 200;
        response.data = data;
        return response;
    }

    static fail<T>(exception: any): Response<T> {
        const response = new Response<T>();
        response.success = false;
        if (exception?.response?.data) {
            response.status = exception.response.status;
            const data = exception?.response?.data;
            if (data.errors) {
                response.errors = {};
                for (const key in data.errors) {
                    // checks by array
                    if (Array.isArray(data.errors[key])) {
                        response.errors[key] = data.errors[key][0];
                    } else {
                        response.errors[key] = data.errors[key];
                    }
                }
            } else
            if (data.error) {
                response.error = data.error;
            } else if (data.title) {
                response.error = data.title;
            } else {
                response.error = "An error occurred";
            }
        } else if (exception?.message) {
            response.error = exception.message;
        } else {
            response.error = "An error occurred";
        }
        return response;
    }
}
