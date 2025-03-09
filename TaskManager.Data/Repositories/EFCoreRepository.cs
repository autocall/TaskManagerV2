using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;
using TaskManager.Data.Extensions;
using System.Linq.Expressions;
using TaskManager.Data.Helpers;

namespace TaskManager.Data.Repositories;
public class EFCoreRepository<T> : IRepository<T> where T : BaseEntity {
    /// <summary>
    ///     Holds db context instance </summary>
    protected readonly DbContext Context;

    /// <summary>
    ///     Holds generic db set </summary>
    protected readonly DbSet<T> DbSet;

    /// <summary>
    ///     Creates entity repository </summary>
    /// <param name="dbContext">Db Context</param>
    public EFCoreRepository(DbContext dbContext) {
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
    public virtual async Task<T> GetByIdAsync(int id) {
        return await DbSet.FindAsync(id);
    }

    public async Task InsertAsync(T model, int userId) {
        if (model.Id == default) {
            model.Id = DbRandomHelper.NewInt32();
        }
        model.CreatedById = userId;
        model.ModifiedById = userId;
        model.CreatedDateTime = DateTime.UtcNow;
        model.ModifiedDateTime = DateTime.UtcNow;
        this.DbSet.Add(model);
        await this.Context.SaveChangesAsync();
    }

    public Task InsertAsync(IEnumerable<T> models, int userId) {
        throw new NotImplementedException();
    }

    public async Task<int> UpdateAsync<TMap>(T newModel, int userId) where TMap : IBaseUpdateMap {
        return await DbSet.Where(e => e.Id == newModel.Id).ExecutePatchUpdateAsync(
             b => {
                 foreach (var property in typeof(TMap).GetProperties()) {
                     Type type = typeof(T);
                     ParameterExpression arg = Expression.Parameter(type, "x");
                     var expr = Expression.Property(arg, property);
                     var exprProperty = Expression.Lambda(expr, arg);
                     var m = b.GetType().GetMethod(nameof(EFCoreSetPropertyBuilder<T>.SetProperty)).MakeGenericMethod(property.PropertyType);
                     var value = property.GetValue(newModel);
                     b = (EFCoreSetPropertyBuilder<T>)m.Invoke(b, [exprProperty, value]);
                 }
                 b = b.SetProperty(e => e.ModifiedById, userId);
                 b = b.SetProperty(e => e.ModifiedDateTime, DateTime.UtcNow);
             });
    }

    public async Task<int> UpdateIsDeletedAsync(int id, bool value, int userId) {
        return await DbSet.Where(e => e.Id == id).ExecutePatchUpdateAsync(
            b => {
                b = b.SetProperty(e => e.IsDeleted, value);
                b = b.SetProperty(e => e.ModifiedById, userId);
                b = b.SetProperty(e => e.ModifiedDateTime, DateTime.UtcNow);
            });
    }

    public async Task<int> DeleteAsync(int id) {
        return await DbSet.Where(e => e.Id == id).ExecuteDeleteAsync();
    }
}
