using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;
using TaskManager.Data.Mappings;

namespace TaskManager.Data.Context;
/// <summary>
///     Task Manager V2 DataBase Context </summary>
/// <remarks>
/// database collation: SQL_Latin1_General_CP1_CI_AS
/// column collation: Latin1_General_100_CI_AI_SC_UTF8
/// В БД кириллицу вставляет как '?'
/// Решения:
/// 1. Используй nvarchar
/// 2. Используй varchar collation *_UTF8
///   2.1. Через SqlKata.Insert не сработает, т.к. параметр 'фыв', вместо N'фыв'
///   2.2. Добавил миграцию с изменением типа varchar на nvarchar, но содержимое миграции убираю.
///      Теперь после SaveChanges параметр [Text] поймал тип nvarchar и меняет парамерт на N'фыв', который varchar collation *_UTF8
/// </remarks>
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
        modelBuilder.ApplyConfiguration(new CategoryMap());
        modelBuilder.ApplyConfiguration(new EventMap());
    }
}
