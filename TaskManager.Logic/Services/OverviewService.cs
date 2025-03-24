using TaskManager.Logic.Dtos;
using TaskManager.Logic.Dtos.Identity;

namespace TaskManager.Logic.Services;
public class OverviewService : BaseService {
    public OverviewService(ServicesHost host) : base(host) { }

    public async Task<(
        List<CategoryDto> categories,
        List<ProjectDto> projects,
        List<TaskDto> tasks,
        List<CommentDto> comments,
        List<TmUserDto> users,
        List<FileDto> files)>
        GetAsync(FilterDto filter, int companyId) {
        var categoryService = this.Host.GetService<CategoryService>();
        var projectService = this.Host.GetService<ProjectService>();
        var taskService = this.Host.GetService<TaskService>();
        var commentService = this.Host.GetService<CommentService>();
        var fileService = this.Host.GetService<CachedFileService>();
        var userService = this.Host.GetService<UserService>();

        var categories = await categoryService.GetAllAsync(companyId);
        var projects = await projectService.GetAllAsync(companyId);
        var tasks = await taskService.GetAllAsync(filter, companyId);
        var tasksQuery = await taskService.GetAllQueryAsync(filter, companyId);
        var comments = await commentService.GetAllAsync(tasksQuery.Select(x => x.Id), companyId);
        var userIds = tasks.SelectMany(x => new int[] { x.CreatedById, x.ModifiedById })
            .Union(comments.SelectMany(x => new int[] { x.CreatedById, x.ModifiedById })).Distinct().ToList();
        var users = await userService.GetByIdsAsync(userIds);
        var objectIds = tasks.Select(x => x.Id).Union(comments.Select(x => x.Id)).ToList();
        var files = await fileService.GetByIdsAsync(companyId, objectIds);

        return (categories, projects, tasks, comments, users, files);
    }
}
