using System.ComponentModel.DataAnnotations;
using TaskManager.Logic.Enums;
using TaskManager.Server.Infrastructure;

namespace TaskManager.Server.Models;

public class CreateCommentViewModel {
    [NotDefault]
    public DateOnly Date { get; set; }
    [NotDefault]
    public decimal WorkHours { get; set; }
    [Required]
    public string Text { get; set; }
    [NotDefault]
    public int TaskId { get; set; }
    [NotDefault]
    public TaskStatusEnum Status { get; set; }
}

public class UpdateCommentViewModel {
    [NotDefault]
    public int Id { get; set; }

    [NotDefault]
    public DateOnly Date { get; set; }
    [NotDefault]
    public decimal WorkHours { get; set; }
    [Required]
    public string Text { get; set; }
    [NotDefault]
    public int TaskId { get; set; }
    [NotDefault]
    public TaskStatusEnum Status { get; set; }
    public List<string> DeleteFileNames { get; set; }
}