namespace TaskManager.Test.Models;

public class LoginModel {
    public string Token { get; set; }
    public IdentityModel Identity { get; set; }
}

public class IdentityModel {
    public int Id { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public string[] Roles { get; set; }
}
