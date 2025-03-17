using LinqToDB;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Enums;

namespace TaskManager.Logic.Services;
public class TaskService : BaseService {
    private IRepository<Task1> Rep(int companyId) => base.Rep<Task1>(companyId);

    public TaskService(ServicesHost host) : base(host) { }

    public async Task<List<TaskDto>> GetAllAsync(FilterDto filter, int companyId) {
        var query = Rep(companyId).GetAll(false);
        if (!string.IsNullOrWhiteSpace(filter.Text)) {
            query = query.Where(x => x.Title.Contains(filter.Text) || x.Description.Contains(filter.Text));
        }
        if (filter.Kind.HasValue) {
            query = query.Where(x => x.Kind == (byte)filter.Kind.Value);
        }
        if (filter.Status.HasValue) {
            query = query.Where(x => x.Status == (byte)filter.Status.Value);
        } else {
            query = query.Where(x => x.Status != (byte)TaskStatusEnum.Canceled && x.Status != (byte)TaskStatusEnum.Closed);
        }
        if (filter.ProjectId.HasValue) {
            query = query.Where(x => x.ProjectId == filter.ProjectId.Value);
        }
        if (filter.Date.HasValue) {
            var timeZone = await this.Host.GetService<ProfileService>().GetTimeZoneAsync(companyId);
            var dateFrom =  filter.Date.Value.ToDateTime(default).AddHours(timeZone.BaseUtcOffset.TotalHours);
            var dateTo = dateFrom.AddDays(1);
            query = query.Where(x => x.CreatedDateTime >= dateFrom && x.CreatedDateTime < dateTo);
        }
        var models = await query.ToListAsync();
        return Mapper.Map<List<TaskDto>>(models);
    }

    public async Task<TaskDto> GetAsync(int id, int companyId) {
        var model = await Rep(companyId).GetByIdAsync(id);
        return Mapper.Map<TaskDto>(model);
    }

    public async Task<TaskDto> CreateAsync(CreateTaskDto dto, int userId, int companyId) {
        var model = new Task1();
        Mapper.Map(dto, model);
        model.Index = await this.GetNextIndexAsync(companyId);
        await Rep(companyId).InsertAsync(model, userId);
        return await this.GetAsync(model.Id, companyId);
    }

    private async Task<int> GetNextIndexAsync(int companyId) {
        var maxIndex = await Rep(companyId).GetAll(false).MaxAsync(x => x.Index);
        return maxIndex + 1;
    }

    public async Task<TaskDto> UpdateAsync(UpdateTaskDto dto, int userId, int companyId) {
        var inModel = Mapper.Map<Task1>(dto);
        await Rep(companyId).UpdateAsync<ITaskUpdateMap>(inModel, userId);
        return await this.GetAsync(dto.Id, companyId);
    }

    public async Task<int> DeleteAsync(int id, int userId, int companyId) {
        return await Rep(companyId).UpdateIsDeletedAsync(id, true, userId);
    }

    public async Task<int> DeletePermanentAsync(int id, int userId, int companyId) {
        return await Rep(companyId).DeleteAsync(id);
    }
}
