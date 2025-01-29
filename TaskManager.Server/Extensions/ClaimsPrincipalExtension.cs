using System.Security.Claims;

namespace TaskManager.Server.Extensions;
public static class ClaimsPrincipalExtension {
    public static Guid GetUserId(this ClaimsPrincipal principal) {
        if (principal == null)
            throw new ArgumentNullException(nameof(principal));

        Claim claim = principal.FindFirst(ClaimTypes.NameIdentifier);
        if (claim == null) {
            return Guid.Empty;
        }
        string userId = principal.FindFirst(ClaimTypes.NameIdentifier).Value;
        return Guid.Parse(userId);
    }

    public static string GetUserName(this ClaimsPrincipal principal) {
        if (principal == null)
            throw new ArgumentNullException(nameof(principal));

        IEnumerable<Claim> claims = principal.FindAll(ClaimTypes.Name);
        return String.Join(", ", claims.Select(e => e.Value));
    }

    public static string GetEmail(this ClaimsPrincipal principal) {
        if (principal == null)
            throw new ArgumentNullException(nameof(principal));

        IEnumerable<Claim> claims = principal.FindAll(ClaimTypes.Email);
        return String.Join(", ", claims.Select(e => e.Value));
    }

    public static string GetRoles(this ClaimsPrincipal principal) {
        if (principal == null)
            throw new ArgumentNullException(nameof(principal));

        IEnumerable<Claim> claims = principal.FindAll(ClaimTypes.Role);
        if (claims.Any()) {
            return String.Join(", ", claims.Select(e => e.Value));
        } else {
            return "no role";
        }
    }
}