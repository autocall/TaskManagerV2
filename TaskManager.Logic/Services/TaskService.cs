using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class TaskService : BaseService {
    //private IRepository<Task> Rep(int companyId) => base.Rep<Task1>(companyId);

    public TaskService(ServicesHost host) : base(host) { }

    public async Task<List<TaskDto>> GetAllAsync(int companyId) {
        await Task.Delay(200);
        //var models = await Rep(companyId).GetAll(false).ToListAsync();
        //return Mapper.Map<List<TaskDto>>(models);
        var categories = await this.Host.GetService<CategoryService>().GetAllAsync(companyId);
        var projects = await this.Host.GetService<ProjectService>().GetAllAsync(companyId);

        var tasks = new List<TaskDto>() {
            new TaskDto(){
                Id = 1,
                Index = 1,
                Title = "Task 1",
                Description = "Task 1 Description",
                Status = TaskStatusEnum.InProgress,
                CategoryId = categories[0].Id,
                ProjectId = projects[0].Id,
                WorkHours = 1.5m,
                Column = TaskColumnEnum.Third,
                Kind = TaskKindEnum.Task,
                CreatedDateTime = DateTime.UtcNow.AddDays(-2),
                CreatedById = TmUser.SystemUserId,
                CommentsCount = 2,
            },
            new TaskDto(){
                Id = 2,
                Index = 2,
                Title = "Fix contacts",
                Description = "https://brokersnapshot.com/Company?dot=3131466&prefix=MC&docket=93362",
                Status = TaskStatusEnum.Canceled,
                CategoryId = categories[0].Id,
                ProjectId = projects[0].Id,
                Column = TaskColumnEnum.Second,
                Kind = TaskKindEnum.Bug,
                CreatedDateTime = DateTime.UtcNow,
                CreatedById = TmUser.AdminUserId,
                CommentsCount = 3,
            },
            new TaskDto(){
                Id = 3,
                Index = 3,
                Title = "check company USDOT: 3848625",
                Description = "Disclaimer:\r\nThis website allows you to spoof GPS locations and safeguard your actual GPS location from being discovered by others. It can be used for purposes like education, entertainment, or privacy protection. However, it must only be used for lawful purposes as permitted by your local laws. Using this website for any illegal activities may result in severe financial and criminal penalties, with the user bearing full responsibility for such consequences. Before  using the website, you should seek legal advice to ensure compliance with the laws applicable to your intended use.\r\n\r\nинфа только тогда быть что нажал галочку. отпечаток девайса. инфу браузера, ip",
                Status = TaskStatusEnum.Closed,
                CategoryId = categories[1].Id,
                Column = TaskColumnEnum.First,
                Kind = TaskKindEnum.Feature,
                CreatedDateTime = DateTime.UtcNow.AddDays(-300),
                CreatedById = TmUser.AdminUserId,
            },
            new TaskDto() {
                Id = 5,
                Index = 5,
                Title = "Task 5",
                Description = "Task 5 Description",
                Status = TaskStatusEnum.New,
                CategoryId = categories[1].Id,
                ProjectId = projects[1].Id,
                Kind = TaskKindEnum.Support,
                Column = TaskColumnEnum.Second,
            },
            new TaskDto() {
                Id = 6,
                Description = "Task 5 Description",
                //Status = TaskStatusEnum.New,
                CategoryId = categories[1].Id,
                //Kind = TaskKindEnum.Task,
                Column = TaskColumnEnum.Second,
            },
            new TaskDto() {
                Id = 6,
                Index = 6,
                Title = "Task 6",
                Description = "Task 6 Description",
                Status = TaskStatusEnum.New,
                CategoryId = categories[2].Id,
                Column = TaskColumnEnum.First,
            }
        };
        return tasks;
    }

    //public async Task<TaskDto> GetAsync(int id, int companyId) {
    //    var model = await Rep(companyId).GetByIdAsync(id);
    //    return Mapper.Map<TaskDto>(model);
    //}

    //public async Task<TaskDto> CreateAsync(CreateTaskDto dto, int userId, int companyId) {
    //    var model = new Task();
    //    Mapper.Map(dto, model);
    //    await Rep(companyId).InsertAsync(model, userId);
    //    return await this.GetAsync(model.Id, companyId);
    //}

    //public async Task<TaskDto> UpdateAsync(UpdateTaskDto dto, int userId, int companyId) {
    //    var inModel = Mapper.Map<Task>(dto);
    //    await Rep(companyId).UpdateAsync<ITaskUpdateMap>(inModel, userId);
    //    return await this.GetAsync(dto.Id, companyId);
    //}

    //public async Task<int> DeleteAsync(int id, int userId, int companyId) {
    //    return await Rep(companyId).UpdateIsDeletedAsync(id, true, userId);
    //}

    //public async Task<int> DeletePermanentAsync(int id, int userId, int companyId) {
    //    return await Rep(companyId).DeleteAsync(id);
    //}
}
