export default function authHeader() : { Authorization: string } {
    const token = localStorage.getItem("token");
    if (token) {
        return { Authorization: "Bearer " + token };
    } else {
        return { Authorization: "" };
    }
}
