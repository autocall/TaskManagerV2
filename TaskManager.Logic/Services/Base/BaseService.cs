using AutoMapper;
using TaskManager.Data;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;

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

    public IRepository<T> Rep<T>(int companyId) where T : BaseCompanyEntity => this.UnitOfWork.GetRepository<T>(companyId);

}
