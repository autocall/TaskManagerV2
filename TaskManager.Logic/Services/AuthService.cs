using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskManager.Data.Entities;

namespace TaskManager.Logic.Services;
public class AuthService : BaseService {
    public AuthService(ServicesHost host) : base(host) { }

    public async Task<string> CreateAsync(TmUser user) {
        var handler = new JwtSecurityTokenHandler();

        var privateKey = Encoding.UTF8.GetBytes(Settings.PrivateKey);

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(privateKey),
            SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor {
            SigningCredentials = credentials,
            Expires = DateTime.UtcNow.AddDays(30),
            Subject = await GenerateClaimsAsync(user)
        };

        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }

    private async Task<ClaimsIdentity> GenerateClaimsAsync(TmUser user) {
        var ci = new ClaimsIdentity();

        ci.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
        ci.AddClaim(new Claim(ClaimTypes.Name, user.UserName));

        ci.AddClaim(new Claim("UserId", user.Id.ToString()));
        ci.AddClaim(new Claim("CompanyId", user.CompanyId.ToString()));
        ci.AddClaim(new Claim("UserName", user.UserName));
        ci.AddClaim(new Claim("Email", user.Email));
        var roles = await Host.UserManager.GetRolesAsync(user);
        ci.AddClaim(new Claim("Roles", String.Join(",", roles)));

        return ci;
    }
}