using System.ComponentModel.DataAnnotations;
using TaskManager.Logic.Enums;

namespace TaskManager.Server.Models;

public class CreateTaskViewModel {
    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    public int CategoryId { get; set; }
    [AllowedValues(TaskColumnEnum.First, TaskColumnEnum.Second, TaskColumnEnum.Third)]
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    public TaskStatusEnum Status { get; set; }
}

public class UpdateTaskViewModel {
    [Required]
    public int Id { get; set; }

    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    public int CategoryId { get; set; }
    [AllowedValues(TaskColumnEnum.First, TaskColumnEnum.Second, TaskColumnEnum.Third)]
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    public TaskStatusEnum Status { get; set; }
}