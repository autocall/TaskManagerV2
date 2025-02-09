export default interface IJwt {
    UserId: number,
    UserName: string,
    Email: string,
    Roles: string,
    nbf: number,
    exp: number,
    iat: number
}