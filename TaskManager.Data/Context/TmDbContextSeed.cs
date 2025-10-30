using LinqToDB.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;
using TaskManager.Data.Enums;
using TaskManager.Data.Helpers;
using TaskManager.Data.Repositories;

namespace TaskManager.Data.Context;
public class TmDbContextSeed {
    public static async Task SeedAsync(LinqToDbContext context, UserManager<TmUser> userManager, RoleManager<TmRole> roleManager) {
        // Reduces contention in tempdb by forcing uniform extent allocations instead of mixed extents,
        // improving performance in high-concurrency environments.
        await context.ExecuteAsync("DBCC TRACEON(1118,-1)"); // (compat 130+) on by default.
        // Dynamically adjusts auto-updated statistics thresholds based on table size, making statistics updates more frequent for large tables.
        await context.ExecuteAsync("DBCC TRACEON(2371,-1)");
        // Disables the automatic clearing of the procedure cache when statistics are updated, preventing sudden performance drops due to recompilations.
        await context.ExecuteAsync("DBCC TRACEON(3979,-1)");
        // Enables a set of optimizer hotfixes that improve query performance, especially for newer SQL Server versions.
        await context.ExecuteAsync("DBCC TRACEON(4199,-1)"); // (compat 130+) on by default.

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

        var companyRep = new LinqToDbRepository<Company>(context);
        if (await companyRep.GetByIdAsync(Company.SystemCompanyId) == null) {
            await companyRep.InsertAsync(new Company {
                Id = Company.SystemCompanyId,
            }, Company.SystemCompanyId);
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

        foreach (var user in await userManager.Users.ToListAsync()) {
            await GenerateExampleDataAsync(context, user);
        }

        // Seed test user
        // TODO: Check Back Tests without the prepared test user
        //if (await userManager.FindByNameAsync(Settings.TestUserName) == null) {
        //    var companyId = DbRandomHelper.NewInt32();
        //    await context.Set<Company>().AddAsync(new Company {
        //        Id = companyId,
        //        CreatedDateTime = DateTime.UtcNow,
        //        ModifiedDateTime = DateTime.UtcNow,
        //    });
        //    var user = new TmUser {
        //        Id = DbRandomHelper.NewInt32(),
        //        CompanyId = companyId,
        //        CreatedId = TmUser.SystemUserId,
        //        ModifiedId = TmUser.SystemUserId,
        //        UserName = Settings.TestUserName,
        //        Email = Settings.TestUserEmail,
        //        CreatedDateTime = DateTime.UtcNow,
        //        ModifiedDateTime = DateTime.UtcNow,
        //    }; 
        //    await userManager.CreateAsync(user, Settings.DefaultPassword);
        //    await userManager.AddToRoleAsync(user, RoleEnum.User.ToString());
        //}
    }

    public static async Task GenerateExampleDataAsync(LinqToDbContext context, TmUser user) {
        var categoryRep = new CompanyLinqToDbRepository<Category>(context, user.CompanyId);
        var namesColors = new Dictionary<string, int> {
            { "Critical", 0xff0000 },
            { "Important", 0xBBBB00 },
            { "General", 0x0000DD },
        };

        var categories = await categoryRep.GetAll(false).ToListAsync();
        // delete code
        //if (user.Email == "test@tm.com") {
        //    foreach (var category in categories) {
        //        await categoryRep.DeleteAsync(category.Id);
        //    }
        //    categories.Clear();
        //}
        if (categories.Any() == false) {
            foreach (var (name, color) in namesColors) {
                await categoryRep.InsertAsync(new Category {
                    Id = DbRandomHelper.NewInt32(),
                    Name = name,
                    Color = color,
                }, user.Id);
            }
        }
    }
}
