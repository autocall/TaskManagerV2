using TaskManager.Logic.Enums;
using TaskManager.Server.Infrastructure;

namespace TaskManager.Server.Models;
public class CreateTaskViewModel {
    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    [NotDefault]
    public int CategoryId { get; set; }
    [NotDefault]
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    [NotDefault]
    public TaskStatusEnum Status { get; set; }
}

public class UpdateTaskViewModel {
    [NotDefault]
    public int Id { get; set; }

    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    [NotDefault]
    public int CategoryId { get; set; }
    [NotDefault]
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    [NotDefault]
    public TaskStatusEnum Status { get; set; }
    public List<string> DeleteFileNames { get; set; }
}

