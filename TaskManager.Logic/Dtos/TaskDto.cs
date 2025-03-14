using TaskManager.Logic.Enums;

namespace TaskManager.Logic.Dtos;

public interface IEnumTaskDtoMap {
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    public TaskStatusEnum Status { get; set; }
}

public class TaskDto : BaseCompanyDto, IEnumTaskDtoMap {
    public int Index { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    public int CategoryId { get; set; }
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    public TaskStatusEnum Status { get; set; }
    public decimal WorkHours { get; set; }
    public int CommentsCount { get; set; }
}

public class CreateTaskDto : IEnumTaskDtoMap {
    public int Index { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    public int CategoryId { get; set; }
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    public TaskStatusEnum Status { get; set; }
    public decimal WorkHours { get; set; }
}

public class UpdateTaskDto : IEnumTaskDtoMap {
    public int Id { get; set; }

    public int Index { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    public int CategoryId { get; set; }
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    public TaskStatusEnum Status { get; set; }
    public decimal WorkHours { get; set; }
}