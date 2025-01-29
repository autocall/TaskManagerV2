using TaskManager.Data.Context;
using TaskManager.Data.Entities;

namespace TaskManager.Data;
public class UnitOfWork: IDisposable {
    public TmDbContext Context { get; }
    /// <summary>
    ///     Holds registered repositories </summary>
    private readonly Dictionary<Type, IRepository> repositories = new();

    public UnitOfWork(TmDbContext context) {
        this.Context = context;
    }

    private List<TmRole> roles = null;
    public List<TmRole> Roles {
        get {
            if (roles == null) {
                roles = this.Context.Set<TmRole>().ToList();
            }
            return roles;
        }
    }

    /// <summary>
    ///     Get repository by entity type </summary>
    /// <typeparam name="T">Entity type</typeparam>
    /// <returns>Repository instance</returns>
    public Repository<T> GetRepository<T>() where T : BaseEntity {
        // check if repository exist in cache
        if (repositories.ContainsKey(typeof(T)))
            return repositories[typeof(T)] as Repository<T>;
        // if not then create a new instance and add to cache
        var repositoryType = typeof(Repository<>).MakeGenericType(typeof(T));
        var repository = (Repository<T>)Activator.CreateInstance(repositoryType, this.Context);
        repositories.Add(typeof(T), repository);

        return repository;
    }

    public void Dispose() {
        this.Context.Dispose();
    }
}
