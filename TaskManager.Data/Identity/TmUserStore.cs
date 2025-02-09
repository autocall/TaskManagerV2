using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using TaskManager.Data.Context;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Identity;
public class TmUserStore : UserStore<TmUser, TmRole, TmDbContext, int, TmUserClaim, TmUserRole, TmUserLogin, TmUserToken, TmRoleClaim> {
    public TmUserStore(TmDbContext context) : base(context) {
    }
}
