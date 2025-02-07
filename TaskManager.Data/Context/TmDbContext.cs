using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;
using TaskManager.Data.Mappings;

namespace TaskManager.Data.Context;
public class TmDbContext : IdentityDbContext<TmUser, TmRole, int, TmUserClaim, TmUserRole, TmUserLogin, TmRoleClaim, TmUserToken> {
    public TmDbContext(DbContextOptions<TmDbContext> options) : base(options) {
    }

    /// <summary>
    ///     Builds models </summary>
    /// <param name="modelBuilder">Models builder</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        // Identity
        modelBuilder.Entity<TmUser>().ToTable("IdentityUsers");
        modelBuilder.Entity<TmRole>().ToTable("IdentityRoles");

        modelBuilder.Entity<TmUserRole>().ToTable("IdentityUserRoles");
        modelBuilder.Entity<TmRoleClaim>().ToTable("IdentityRoleClaim");
        modelBuilder.Entity<TmUserLogin>().ToTable("IdentityUserLogins");
        modelBuilder.Entity<TmUserClaim>().ToTable("IdentityUserClaims");
        modelBuilder.Entity<TmUserToken>().ToTable("IdentityUserToken");

        modelBuilder.ApplyConfiguration(new ProjectMap());
    }
}
