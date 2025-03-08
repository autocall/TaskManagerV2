using LinqToDB;
using TaskManager.Data.Context;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;

namespace TaskManager.Data;
public class UnitOfWork : IDisposable {
    public LinqToDbContext Context { get; }
    /// <summary>
    ///     Holds registered repositories </summary>
    private readonly Dictionary<Type, IRepository> repositories = new();

    private readonly Dictionary<Type, ICompanyRepository> companyRepositories = new();

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
        if (repositories.ContainsKey(typeof(T)))
            return repositories[typeof(T)] as LinqToDbRepository<T>;
        // if not then create a new instance and add to cache
        var repositoryType = typeof(LinqToDbRepository<>).MakeGenericType(typeof(T));
        var repository = (LinqToDbRepository<T>)Activator.CreateInstance(repositoryType, this.Context);
        repositories.Add(typeof(T), repository);

        return repository;
    }

    /// <summary>
    ///     Get repository by entity type </summary>
    /// <typeparam name="T">Entity type</typeparam>
    /// <returns>Repository instance</returns>
    public IRepository<T> GetRepository<T>(int companyId) where T : BaseCompanyEntity {
        // check if repository exist in cache
        if (repositories.ContainsKey(typeof(T)))
            return repositories[typeof(T)] as CompanyLinqToDbRepository<T>;
        // if not then create a new instance and add to cache
        var repositoryType = typeof(CompanyLinqToDbRepository<>).MakeGenericType(typeof(T));
        var repository = (CompanyLinqToDbRepository<T>)Activator.CreateInstance(repositoryType, this.Context, companyId);
        repositories.Add(typeof(T), repository);

        return repository;
    }

    /// <summary>
    ///     Get repository by entity type </summary>
    /// <typeparam name="T">Entity type</typeparam>
    /// <returns>Repository instance</returns>
    public ICompanyRepository<T> GetCompanyRepository<T>() where T : BaseCompanyEntity {
        // check if repository exist in cache
        if (companyRepositories.ContainsKey(typeof(T)))
            return companyRepositories[typeof(T)] as CompanyRepository<T>;
        // if not then create a new instance and add to cache
        var repositoryType = typeof(CompanyRepository<>).MakeGenericType(typeof(T));
        var repository = (CompanyRepository<T>)Activator.CreateInstance(repositoryType, this);
        companyRepositories.Add(typeof(T), repository);

        return repository;
    }

    public void Dispose() {
        this.Context.Dispose();
    }
}
