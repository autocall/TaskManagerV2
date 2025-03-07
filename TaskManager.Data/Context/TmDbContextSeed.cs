using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;
using TaskManager.Data.Enums;
using TaskManager.Data.Helpers;

namespace TaskManager.Data.Context;
public class TmDbContextSeed {
    public static async Task SeedAsync(TmDbContext context, UserManager<TmUser> userManager, RoleManager<TmRole> roleManager) {
        // Reduces contention in tempdb by forcing uniform extent allocations instead of mixed extents,
        // improving performance in high-concurrency environments.
        await context.Database.ExecuteSqlRawAsync("DBCC TRACEON(1118,-1)");
        // Dynamically adjusts auto-updated statistics thresholds based on table size, making statistics updates more frequent for large tables.
        await context.Database.ExecuteSqlRawAsync("DBCC TRACEON(2371,-1)");
        // Disables the automatic clearing of the procedure cache when statistics are updated, preventing sudden performance drops due to recompilations.
        await context.Database.ExecuteSqlRawAsync("DBCC TRACEON(3979,-1)");
        // Enables a set of optimizer hotfixes that improve query performance, especially for newer SQL Server versions.
        await context.Database.ExecuteSqlRawAsync("DBCC TRACEON(4199,-1)");

        var roles = Enum.GetValues(typeof(RoleEnum)).Cast<RoleEnum>();
        foreach (var role in roles) {
            if (!await roleManager.RoleExistsAsync(role.ToString())) {
                var id = role switch {
                    RoleEnum.User => 1,
                    RoleEnum.Admin => 100,
                    _ => DbRandomHelper.NewInt32(),
                };
                await roleManager.CreateAsync(new TmRole { Id = id, Name = role.ToString() });
            }
        }

        if (await userManager.FindByIdAsync(TmUser.SystemUser.Id.ToString()) == null) {
            var user = TmUser.SystemUser;
            await userManager.CreateAsync(user, Settings.DefaultPassword);
            await userManager.AddToRoleAsync(user, RoleEnum.Admin.ToString());
        }

        if (await userManager.FindByIdAsync(TmUser.AdminUser.Id.ToString()) == null) {
            var user = TmUser.AdminUser;
            await userManager.CreateAsync(user, Settings.DefaultPassword);
            await userManager.AddToRoleAsync(user, RoleEnum.Admin.ToString());
        }

        if (await context.Set<Company>().FindAsync(Company.SystemCompanyId) == null) {
            await context.Set<Company>().AddAsync(new Company {
                Id = Company.SystemCompanyId,
                CreatedDateTime = DateTime.UtcNow,
                ModifiedDateTime = DateTime.UtcNow,
            });
        }
    }
}
