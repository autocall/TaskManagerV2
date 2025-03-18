using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using TaskManager.Data.Context;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Identity;
public class TmUserStore : UserStore<TmUser, TmRole, TmDbContext, int, TmUserClaim, TmUserRole, TmUserLogin, TmUserToken, TmRoleClaim> {
    private LinqToDbContext LinqToDbContext { get; }
    public TmUserStore(TmDbContext context, LinqToDbContext linqToDbContext ) : base(context) {
        LinqToDbContext = linqToDbContext;
    }

    public override async Task<IdentityResult> CreateAsync(TmUser user, CancellationToken cancellationToken = default) {
        var result = await base.CreateAsync(user, cancellationToken);
        if (result.Succeeded) {
            await TmDbContextSeed.GenerateExampleDataAsync(LinqToDbContext, user);
        }
        return result;
    }
}
