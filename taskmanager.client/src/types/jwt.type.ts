export default interface IJwt {
    UserId: string,
    UserName: string,
    Email: string,
    Roles: string,
    CompanyId: string,
    CompanyName: string,
    nbf: number,
    exp: number,
    iat: number
}