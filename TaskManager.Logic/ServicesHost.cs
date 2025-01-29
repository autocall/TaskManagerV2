using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using TaskManager.Data;
using TaskManager.Data.Entities;
using TaskManager.Logic.Services;

namespace TaskManager.Logic;
public class ServicesHost {

    /// <summary>
    ///     Holds registered services </summary>
    private readonly Dictionary<Type, IService> services = new Dictionary<Type, IService>();

    private RoleManager<TmRole> _roleManager;
    /// <summary>
    ///     Gets Role Manager </summary>
    public RoleManager<TmRole> RoleManager {
        get {
            if (_roleManager == null) {
                _roleManager = this.ServiceProvider.GetRequiredService<RoleManager<TmRole>>();
            }
            return _roleManager;
        }
    }

    private UserManager<TmUser> _userManager;
    /// <summary>
    ///     Gets User Manager </summary>
    public UserManager<TmUser> UserManager {
        get {
            if (_userManager == null) {
                _userManager = this.ServiceProvider.GetRequiredService<UserManager<TmUser>>();
            }
            return _userManager;
        }
    }

    /// <summary>
    ///     Gets Unit Of Work </summary>
    public UnitOfWork UnitOfWork { get; }
    /// <summary>
    ///     Gets Mapper </summary>
    public IMapper Mapper { get; }

    public IServiceProvider ServiceProvider { get; }

    public ServicesHost(UnitOfWork unitOfWork, IMapper mapper, IServiceProvider serviceProvider) {
        this.ServiceProvider = serviceProvider;
        this.UnitOfWork = unitOfWork;
        this.Mapper = mapper;
    }

    /// <summary>
    ///     Gets Service by it's type </summary>
    /// <typeparam name="T">Service type</typeparam>
    /// <returns>Service instance</returns>
    public T GetService<T>() where T : IService {
        if (services.ContainsKey(typeof(T)) == false)
            services[typeof(T)] = (T)Activator.CreateInstance(typeof(T), this);
        return (T)services[typeof(T)];
    }
}
