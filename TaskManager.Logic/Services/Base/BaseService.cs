using AutoMapper;
using TaskManager.Data;

namespace TaskManager.Logic.Services;
public interface IService { }
public abstract class BaseService : IService {
    protected readonly UnitOfWork UnitOfWork;
    protected readonly IMapper Mapper;
    protected readonly ServicesHost Host;

    public BaseService(ServicesHost host) {
        this.UnitOfWork = host.UnitOfWork;
        this.Mapper = host.Mapper;
        this.Host = host;
    }
}
