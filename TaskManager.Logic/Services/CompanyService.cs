using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class CompanyService : BaseService {
    private IRepository<Company> Rep => this.UnitOfWork.GetRepository<Company>();

    public CompanyService(ServicesHost host) : base(host) { }

    public async Task<CompanyDto> GetAsync(int id) {
        var model = await Rep.GetByIdAsync(id);
        return Mapper.Map<CompanyDto>(model);
    }

    public async Task<CompanyDto> CreateAsync() {
        var model = new Company();
        await Rep.InsertAsync(model, TmUser.SystemUserId);
        return await this.GetAsync(model.Id);
    }
}
