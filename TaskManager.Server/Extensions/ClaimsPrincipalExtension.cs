﻿using System.Security.Claims;

namespace TaskManager.Server.Extensions;
public static class ClaimsPrincipalExtension {
    public static int GetUserId(this ClaimsPrincipal principal) {
        if (principal == null)
            throw new ArgumentNullException(nameof(principal));

        Claim claim = principal.FindFirst(ClaimTypes.NameIdentifier);
        if (claim == null) {
            return default;
        }
        string userId = principal.FindFirst(ClaimTypes.NameIdentifier).Value;
        return Int32.Parse(userId);
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

    public static int GetCompanyId(this ClaimsPrincipal principal) {
        Claim claim = principal.FindFirst("CompanyId");
        if (claim == null) {
            throw new Exception("CompanyId claim not found");
        }
        return Int32.Parse(claim.Value);
    }
}