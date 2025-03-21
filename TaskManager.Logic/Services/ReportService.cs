using LinqToDB;
using TaskManager.Data.Entities;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class ReportService : BaseService {
    public ReportService(ServicesHost host) : base(host) {
    }

    public async Task<ReportDto> GetAsync(DateOnly date, int userId, int companyId) {
        var comments = await UnitOfWork.GetRepository<Comment>(companyId).GetAll(false).Where(x => x.Date == date).ToListAsync();
        var taskIds = comments.Select(e => e.TaskId).ToList();
        var tasks = await UnitOfWork.GetRepository<Task1>(companyId).GetAll(false).Where(x => taskIds.Contains(x.Id)).ToListAsync();
        var projectIds = tasks.Select(e => e.ProjectId).ToList();
        var projects = await UnitOfWork.GetRepository<Project>(companyId).GetAll(false).Where(x => projectIds.Contains(x.Id)).ToListAsync();

        var commentDtos = new List<ReportCommentDto>();
        var taskDtos = new List<ReportTaskDto>();
        var projectDtos = new List<ReportProjectDto>();
        foreach (var comment in comments.OrderByDescending(x => x.CreatedDateTime)) {
            commentDtos.Add(Mapper.Map<ReportCommentDto>(Mapper.Map<CommentDto>(comment)));
        }
        foreach (var task in tasks) {
            var taskDto = Mapper.Map<ReportTaskDto>(Mapper.Map<TaskDto>(task));
            taskDto.Comments = commentDtos.Where(x => x.TaskId == task.Id).ToList();
            taskDto.WorkHours = taskDto.Comments.Sum(x => x.WorkHours);
            taskDtos.Add(taskDto);
        }
        foreach (var project in projects) {
            var projectDto = Mapper.Map<ReportProjectDto>(Mapper.Map<ProjectDto>(project));
            projectDto.Tasks = taskDtos.Where(x => x.ProjectId == project.Id).ToList();
            projectDto.WorkHours = projectDto.Tasks.Sum(x => x.WorkHours);
            projectDtos.Add(projectDto);
        }
        var reportDto = new ReportDto {
            Projects = projectDtos,
            WorkHours = projectDtos.Sum(x => x.WorkHours)
        };
        return reportDto;
    }
}
