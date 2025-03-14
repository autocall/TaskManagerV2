using System.ComponentModel.DataAnnotations;
using TaskManager.Logic.Enums;

namespace TaskManager.Server.Models;

public class CreateEventViewModel {
    [Required]
    public DateOnly Date { get; set; }
    [Required, MinLength(2)]
    public string Name { get; set; }
    public string Description { get; set; }

    public EventRepeatEnum RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public EventTypeEnum Type { get; set; }
}

public class UpdateEventViewModel {
    [Required]
    public int Id { get; set; }
    [Required]
    public DateOnly Date { get; set; }
    [Required, MinLength(2)]
    public string Name { get; set; }
    public string Description { get; set; }

    public EventRepeatEnum RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public EventTypeEnum Type { get; set; }
}

public class CompleteEventViewModel {
    [Required]
    public int Id { get; set; }
}