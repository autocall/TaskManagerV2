using TaskManager.Data.Entities;

namespace TaskManager.Data.Repositories;

public interface IRepository { }
public interface ICompanyRepository<T> {
    IRepository<T> Get(int CompanyId);

}
public interface IRepository<T> : IRepository {

    /// <summary>
    ///     Creates entity repository </summary>
    /// <param name="dbContext">Db Context</param>
    IQueryable<T> GetAll(bool includeIsDeleted);

    /// <summary>
    ///     Gets entity by PK Id </summary>
    /// <param name="id">Id</param>
    /// <returns>Entity instance</returns>
    Task<T> GetByIdAsync(int id);

    /// <summary>
    ///     Create entity </summary>
    /// </summary>
    Task InsertAsync(T model, int userId);

    /// <summary>
    ///     Create entity </summary>
    /// </summary>
    Task InsertAsync(IEnumerable<T> models, int userId);

    /// <summary>
    ///     Update entity </summary>
    Task<int> UpdateAsync<TMap>(T newModel, int userId) where TMap : IBaseUpdateMap;

    /// <summary>
    ///     Update IsDeleted field of entity by Id </summary>
    Task<int> UpdateIsDeletedAsync(int id, bool value, int userId);

    /// <summary>
    ///     Delete entity by Id </summary>
    Task<int> DeleteAsync(int id);
}