using LinqToDB;
using TaskManager.Data.Context;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;

namespace TaskManager.Data;
public class UnitOfWork : IDisposable {
    public LinqToDbContext Context { get; }
    /// <summary>
    ///     Holds registered repositories </summary>
    /// <remarks>
    /// Separates repositories by type and company id
    /// </remarks>
    private readonly Dictionary<(Type, int), IRepository> repositories = new();

    public UnitOfWork(LinqToDbContext context) {
        this.Context = context;
    }

    private List<TmRole> roles = null;
    public List<TmRole> Roles {
        get {
            if (roles == null) {
                roles = this.Context.GetTable<TmRole>().ToList();
            }
            return roles;
        }
    }

    /// <summary>
    ///     Get repository by entity type </summary>
    /// <typeparam name="T">Entity type</typeparam>
    /// <returns>Repository instance</returns>
    public IRepository<T> GetRepository<T>() where T : BaseEntity {
        // check if repository exist in cache
        if (repositories.ContainsKey((typeof(T), default)))
            return repositories[(typeof(T), default)] as LinqToDbRepository<T>;
        // if not then create a new instance and add to cache
        var repositoryType = typeof(LinqToDbRepository<>).MakeGenericType(typeof(T));
        var repository = (LinqToDbRepository<T>)Activator.CreateInstance(repositoryType, this.Context);
        repositories.Add((typeof(T), default), repository);

        return repository;
    }

    /// <summary>
    ///     Get filterd repository by entity type and company Id </summary>
    /// <typeparam name="T">Entity type</typeparam>
    /// <param name="companyId">Company Id</param>
    /// <returns>Repository instance</returns>
    public IRepository<T> GetRepository<T>(int companyId) where T : BaseCompanyEntity {
        // check if repository exist in cache
        if (repositories.ContainsKey((typeof(T), companyId)))
            return repositories[(typeof(T), companyId)] as CompanyLinqToDbRepository<T>;
        // if not then create a new instance and add to cache
        var repositoryType = typeof(CompanyLinqToDbRepository<>).MakeGenericType(typeof(T));
        var repository = (CompanyLinqToDbRepository<T>)Activator.CreateInstance(repositoryType, this.Context, companyId);
        repositories.Add((typeof(T), companyId), repository);

        return repository;
    }

    public void Dispose() {
        this.Context.Dispose();
    }
}
