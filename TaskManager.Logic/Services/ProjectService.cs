using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Data;
using TaskManager.Data.Entities;
using TaskManager.Data.Helpers;
using TaskManager.Logic.Dtos.Identity;

namespace TaskManager.Logic.Services;
public class ProjectService : BaseService {
    private Repository<Project> Rep => UnitOfWork.GetRepository<Project>();

    public ProjectService(ServicesHost host) : base(host) { }

    public async Task<List<ProjectDto>> GetAllAsync() {
        var models = await Rep.GetAll(false).ToListAsync();
        return Mapper.Map<List<ProjectDto>>(models);
    }

    public async Task<ProjectDto> GetAsync(int id) {
        var model = await Rep.GetByIdAsync(id);
        return Mapper.Map<ProjectDto>(model);
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto, int userId) {
        var model = new Project();
        Mapper.Map(dto, model);
        await Rep.ExecuteCreateAsync(model, userId);
        return await this.GetAsync(model.Id);
    }

    public async Task<ProjectDto> UpdateAsync(UpdateProjectDto dto, int userId) {
        var inModel = Mapper.Map<Project>(dto);
        await Rep.ExecuteUpdateAsync<IProjectUpdateMap>(inModel, userId);
        return await this.GetAsync(dto.Id);
    }

    public async Task<int> DeleteAsync(int id, int userId) {
        return await Rep.ExecuteUpdateIsDeletedAsync(id, true, userId);
    }
}
