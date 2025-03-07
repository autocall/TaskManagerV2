using LinqToDB;
using LinqToDB.Data;
using LinqToDB.EntityFrameworkCore;
using LinqToDB.Linq;
using TaskManager.Data.Context;
using TaskManager.Data.Entities;
using TaskManager.Data.Extensions;
using TaskManager.Data.Helpers;

namespace TaskManager.Data.Repositories;
public class LinqToDbRepository<T> : IRepository<T> where T : BaseEntity {
    /// <summary>
    ///     Holds db context instance </summary>
    protected readonly DataConnection Connection;

    /// <summary>
    ///     Holds generic table </summary>
    protected virtual IQueryable<T> Table() {
        return Connection.GetTable<T>();
    }
    public LinqToDbRepository(Microsoft.EntityFrameworkCore.DbContext dbContext) {
        Connection = new LinqToDbContext((TmDbContext)dbContext);
    }

    /// <summary>
    ///     Creates entity repository </summary>
    /// <param name="dbContext">Db Context</param>
    public virtual IQueryable<T> GetAll(bool includeIsDeleted) {
        return includeIsDeleted ? Table() : Table().Where(e => !e.IsDeleted);
    }

    /// <summary>
    ///     Gets entity by PK Id </summary>
    /// <param name="id">Id</param>
    /// <returns>Entity instance</returns>
    public virtual async Task<T> GetByIdAsync(int id) {
        return await Table().FirstOrDefaultAsync(e => e.Id == id);
    }

    /// <summary>
    ///     Create entity </summary>
    /// </summary>
    public virtual async Task InsertAsync(T model, int userId) {
        if (model.Id == default) {
            model.Id = DbRandomHelper.NewInt32();
        }
        model.CreatedById = userId;
        model.ModifiedById = userId;
        model.CreatedDateTime = DateTime.UtcNow;
        model.ModifiedDateTime = DateTime.UtcNow;

        await Connection.InsertAsync(model);
    }

    /// <summary>
    ///     Create entity </summary>
    /// </summary>
    public virtual async Task InsertAsync(IEnumerable<T> models, int userId) {
        foreach (var model in models) {

            if (model.Id == default) {
                model.Id = DbRandomHelper.NewInt32();
            }
            model.CreatedById = userId;
            model.ModifiedById = userId;
            model.CreatedDateTime = DateTime.UtcNow;
            model.ModifiedDateTime = DateTime.UtcNow;
        }

        await Connection.BulkCopyAsync(models);
    }


    public virtual async Task<int> UpdateAsync<TMap>(T newModel, int userId) where TMap : IBaseUpdateMap {
        IUpdatable<T> query = Table()
            .Where(e => e.Id == newModel.Id)
            .Set(e => e.ModifiedById, userId)
            .Set(e => e.ModifiedDateTime, DateTime.UtcNow);

        foreach (var prop in typeof(TMap).GetProperties()) {
            query = query.Set(newModel, prop);
        }

        return await query.UpdateAsync();
    }

    /// <summary>
    ///     Update IsDeleted field of entity by Id </summary>
    public virtual async Task<int> UpdateIsDeletedAsync(int id, bool value, int userId) {
        return await Table()
            .Where(e => e.Id == id)
            .Set(e => e.IsDeleted, value)
            .Set(e => e.ModifiedById, userId)
            .Set(e => e.ModifiedDateTime, DateTime.UtcNow)
            .UpdateAsync();
    }

    /// <summary>
    ///     Delete entity by Id </summary>
    public virtual async Task<int> DeleteAsync(int id) {
        return await Table().Where(e => e.Id == id).DeleteAsync();
    }
}
