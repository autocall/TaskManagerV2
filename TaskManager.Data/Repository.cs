using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;
using TaskManager.Data.Extensions;
using System.Linq.Expressions;

namespace TaskManager.Data;
public interface IRepository { }
public class Repository<T> : IRepository where T : BaseEntity {
    /// <summary>
    ///     Holds db context instance </summary>
    protected readonly DbContext Context;

    /// <summary>
    ///     Holds generic db set </summary>
    protected readonly DbSet<T> DbSet;

    /// <summary>
    ///     Creates entity repository </summary>
    /// <param name="dbContext">Db Context</param>
    public Repository(DbContext dbContext) {
        Context = dbContext;
        DbSet = Context.Set<T>();
    }

    /// <summary>
    ///     Gets all entities list </summary>
    /// <returns>Entities list</returns>
    public virtual IQueryable<T> GetAll(bool includeIsDeleted) {
        if (includeIsDeleted) {
            return DbSet;
        } else {
            return DbSet.Where(e => e.IsDeleted == false);
        }
    }

    /// <summary>
    ///     Gets entity by PK Id </summary>
    /// <param name="id">Id</param>
    /// <returns>Entity instance</returns>
    public virtual async Task<T> GetByIdAsync(Guid id) {
        return await DbSet.FindAsync(id);
    }

    public async Task ExecuteUpdateAsync<TMap>(T newModel, Guid userId) where TMap : IBaseUpdateMap {
        await QueryableExecutePatchUpdateExtensions.ExecutePatchUpdateAsync(
             this.DbSet.Where(e => e.EntityId == newModel.EntityId),
             b => {
                 foreach (var property in typeof(TMap).GetProperties()) {
                     Type type = typeof(T);
                     ParameterExpression arg = Expression.Parameter(type, "x");
                     var expr = Expression.Property(arg, property);
                     var exprProperty = Expression.Lambda(expr, arg);
                     var m = b.GetType().GetMethod("SetProperty").MakeGenericMethod(property.PropertyType);
                     var value = property.GetValue(newModel);
                     b = (SetPropertyBuilder<T>)m.Invoke(b, [exprProperty, value]);
                 }
                 b = b.SetProperty<Guid>(e => e.ModifiedById, userId);
                 b = b.SetProperty<DateTime>(e => e.ModifiedDateTime, DateTime.UtcNow);
             });
    }

    public async Task ExecuteUpdateIsDeletedAsync(Guid entityId, bool value, Guid userId) {
        await QueryableExecutePatchUpdateExtensions.ExecutePatchUpdateAsync(
            this.DbSet.Where(e => e.EntityId == entityId),
            b => {
                b = b.SetProperty<bool>(e => e.IsDeleted, value);
                b = b.SetProperty<Guid>(e => e.ModifiedById, userId);
                b = b.SetProperty<DateTime>(e => e.ModifiedDateTime, DateTime.UtcNow);
            });
    }

    public async Task<int> ExecuteDeleteAsync(Guid entityId) {
        return await this.DbSet.Where(e => e.EntityId == entityId).ExecuteDeleteAsync();
    }
}
