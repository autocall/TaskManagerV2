using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class ProjectService : BaseService {
    private ICompanyRepository<Project> CompanyRep => UnitOfWork.GetCompanyRepository<Project>();
    private IRepository<Project> Rep(int companyId) => this.CompanyRep.Get(companyId);

    public ProjectService(ServicesHost host) : base(host) { }

    public async Task<List<ProjectDto>> GetAllAsync(int userId, int companyId) {
        var models = await Rep(companyId).GetAll(false).ToListAsync();
        return Mapper.Map<List<ProjectDto>>(models);
    }

    public async Task<ProjectDto> GetAsync(int id, int companyId) {
        var model = await Rep(companyId).GetByIdAsync(id);
        return Mapper.Map<ProjectDto>(model);
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto, int userId, int companyId) {
        var model = new Project();
        Mapper.Map(dto, model);
        await Rep(companyId).InsertAsync(model, userId);
        return await this.GetAsync(model.Id, companyId);
    }

    public async Task<ProjectDto> UpdateAsync(UpdateProjectDto dto, int userId, int companyId) {
        var inModel = Mapper.Map<Project>(dto);
        await Rep(companyId).UpdateAsync<IProjectUpdateMap>(inModel, userId);
        return await this.GetAsync(dto.Id, companyId);
    }

    public async Task<int> DeleteAsync(int id, int userId, int companyId) {
        return await Rep(companyId).UpdateIsDeletedAsync(id, true, userId);
    }

    public async Task<int> DeletePermanentAsync(int id, int userId, int companyId) {
        return await Rep(companyId).DeleteAsync(id);
    }
}
