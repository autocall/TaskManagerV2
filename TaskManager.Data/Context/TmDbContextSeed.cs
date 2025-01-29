using Microsoft.AspNetCore.Identity;
using TaskManager.Data.Entities;
using TaskManager.Data.Enums;

namespace TaskManager.Data.Context;
public class TmDbContextSeed {
    public static async Task SeedAsync(TmDbContext context, UserManager<TmUser> userManager, RoleManager<TmRole> roleManager) {
        // Add seed code here

        var roles = Enum.GetValues(typeof(RoleEnum)).Cast<RoleEnum>();
        foreach (var role in roles) {
            if (!await roleManager.RoleExistsAsync(role.ToString())) {
                var id = role switch {
                    RoleEnum.User => new Guid("DF13F33B-7101-4DD8-831F-037977D0E577"),
                    RoleEnum.Admin => new Guid("3DD6838F-566E-4530-AD7A-0F16D3C55688"),
                    _ => Guid.NewGuid()
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
    }
}
