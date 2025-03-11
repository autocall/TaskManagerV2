using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class TaskService : BaseService {
    //private IRepository<Task> Rep(int companyId) => base.Rep<Task1>(companyId);

    public TaskService(ServicesHost host) : base(host) { }

    public async Task<List<CategoryDto>> GetAllAsync(int companyId) {
        await Task.Delay(200);
        //var models = await Rep(companyId).GetAll(false).ToListAsync();
        //return Mapper.Map<List<TaskDto>>(models);
        var categories = await this.Host.GetService<CategoryService>().GetAllAsync(companyId);
       
        var tasks = new List<TaskDto>() {
            new TaskDto(){
                Id = 1,
                Title = "Task 1",
                Description = "Task 1 Description",
                Status = TaskStatusEnum.New,
                CategoryId = categories[0].Id,
                Column = TaskColumnEnum.First,
            },
            new TaskDto(){
                Id = 2,
                Title = "Task 2",
                Description = "Task 2 Description",
                Status = TaskStatusEnum.New,
                CategoryId = categories[0].Id,
                Column = TaskColumnEnum.Second,
            },
            new TaskDto(){
                Id = 3,
                Title = "Task 3",
                Description = "Task 3 Description",
                Status = TaskStatusEnum.New,
                CategoryId = categories[1].Id,
                Column = TaskColumnEnum.First,
                Comments = new List<CommentDto>() {
                    new CommentDto(){
                        Id = 1,
                        TaskId = 3,
                        DateTime = DateTime.UtcNow,
                        WorkHours = 1,
                        Text = "Comment 1"
                    },
                    new CommentDto() {
                        Id = 2,
                        TaskId = 3,
                        DateTime = DateTime.UtcNow,
                        WorkHours = 2,
                        Text = "Comment 2"
                    }
                }
            },
            new TaskDto() {
                Id = 5,
                Title = "Task 5",
                Description = "Task 5 Description",
                Status = TaskStatusEnum.New,
                CategoryId = categories[1].Id,
                Column = TaskColumnEnum.Second,
            },
            new TaskDto() {
                Id = 6,
                Title = "Task 5",
                Description = "Task 5 Description",
                Status = TaskStatusEnum.New,
                CategoryId = categories[1].Id,
                Column = TaskColumnEnum.Second,
            },
            new TaskDto() {
                Id = 6,
                Title = "Task 6",
                Description = "Task 6 Description",
                Status = TaskStatusEnum.New,
                CategoryId = categories[1].Id,
                Column = TaskColumnEnum.First,
            }
        };

        foreach (CategoryDto category in categories) {
            category.Tasks = tasks.Where(x => x.CategoryId == category.Id).ToList();
        }
        return categories;
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
