using TaskManager.Logic.Enums;

namespace TaskManager.Logic.Dtos;

public interface ITaskUpdateStatusDtoMap {
    public int TaskId { get; set; }
    public TaskStatusEnum Status { get; set; }
}

public class CommentDto : BaseCompanyDto {
    public int TaskId { get; set; }
    public DateOnly Date { get; set; }
    public decimal WorkHours { get; set; }
    public string Text { get; set; }
}

public class CommentViewDto : CommentDto {
    public int TaskIndex { get; set; }
    public TaskStatusEnum TaskStatus { get; set; }
}

public class CreateCommentDto : ITaskUpdateStatusDtoMap {
    public int TaskId { get; set; }
    public DateOnly Date { get; set; }
    public decimal WorkHours { get; set; }
    public string Text { get; set; }
    public TaskStatusEnum Status { get; set; }
}

public class UpdateCommentDto : ITaskUpdateStatusDtoMap {
    public int Id { get; set; }

    public int TaskId { get; set; }
    public DateOnly Date { get; set; }
    public decimal WorkHours { get; set; }
    public string Text { get; set; }
    public TaskStatusEnum Status { get; set; }
}