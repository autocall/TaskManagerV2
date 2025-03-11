namespace TaskManager.Logic.Dtos;
public class TaskDto : BaseCompanyDto {
    public string Title { get; set; }
    public string Description { get; set; }
    public int ProjectId { get; set; }
    public int CategoryId { get; set; }
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    public TaskStatusEnum Status { get; set; }
    public decimal WorkHours { get; set; }

    public List<CommentDto> Comments { get; set; }
}

public class CommentDto : BaseCompanyDto {
    public int TaskId { get; set; }
    public DateTime DateTime { get; set; }
    public decimal WorkHours { get; set; }
    public string Text { get; set; }
}

public enum TaskColumnEnum {
    First = 1,
    Second = 2,
    Third = 3,
}

public enum TaskKindEnum {
    Task = 1,
    Bug = 2,
    Feature = 3,
    Support = 4,
}

public enum TaskStatusEnum {
    New = 1,
    InProgress = 2,
    OnHold = 3,
    Completed = 4,
    Closed = 5,
    Canceled = 6,
}