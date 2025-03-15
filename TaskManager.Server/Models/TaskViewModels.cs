using System.ComponentModel.DataAnnotations;
using TaskManager.Logic.Enums;

namespace TaskManager.Server.Models;

public class CreateTaskViewModel {
    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    [Required]
    public int CategoryId { get; set; }
    [Required]
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    [Required]
    public TaskStatusEnum Status { get; set; }
}

public class UpdateTaskViewModel {
    [Required]
    public int Id { get; set; }

    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    [Required]
    public int CategoryId { get; set; }
    [Required]
    public TaskColumnEnum Column { get; set; }
    public TaskKindEnum Kind { get; set; }
    [Required]
    public TaskStatusEnum Status { get; set; }
}