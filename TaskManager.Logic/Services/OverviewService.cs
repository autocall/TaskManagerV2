using TaskManager.Logic.Dtos;
using TaskManager.Logic.Dtos.Identity;

namespace TaskManager.Logic.Services;
public class OverviewService : BaseService {
    public OverviewService(ServicesHost host) : base(host) { }

    public async Task<(List<CategoryDto> categories, List<ProjectDto> projects, List<TaskDto> tasks, List<CommentDto> comments, List<TmUserDto> users)>
        GetAsync(int companyId) {
        await Task.Delay(200);
        var categoryService = this.Host.GetService<CategoryService>();
        var projectService = this.Host.GetService<ProjectService>();
        var taskService = this.Host.GetService<TaskService>();
        var commentService = this.Host.GetService<CommentService>();

        var categories = await categoryService.GetAllAsync(companyId);
        var projects = await projectService.GetAllAsync(companyId);
        var tasks = await taskService.GetAllAsync(companyId);
        var comments = await commentService.GetAllAsync(companyId);
        var userIds = tasks.SelectMany(x => new int[] { x.CreatedById, x.ModifiedById })
            .Union(comments.SelectMany(x => new int[] { x.CreatedById, x.ModifiedById })).Distinct().ToList();
        var users = await this.Host.GetService<UserService>().GetByIdsAsync(userIds);

        return (categories, projects, tasks, comments, users);
    }
}
