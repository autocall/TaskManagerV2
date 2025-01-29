using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using TaskManager.Data.Context;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Identity;
public class TmRoleStore : RoleStore<TmRole, TmDbContext, Guid, TmUserRole, TmRoleClaim> {
    public TmRoleStore(TmDbContext context) : base(context) {
    }
}