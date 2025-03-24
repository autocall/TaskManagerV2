using System.ComponentModel.DataAnnotations;
using TaskManager.Logic.Enums;
using TaskManager.Server.Infrastructure;

namespace TaskManager.Server.Models;

public class CreateEventViewModel {
    [NotDefault]
    public DateOnly Date { get; set; }
    [Required, MinLength(2)]
    public string Name { get; set; }
    public string Description { get; set; }

    public EventRepeatEnum RepeatType { get; set; }
    public short RepeatValue { get; set; }
    public EventTypeEnum Type { get; set; }
}

public class UpdateEventViewModel {
    [NotDefault]
    public int Id { get; set; }
    [NotDefault]
    public DateOnly Date { get; set; }
    [Required, MinLength(2)]
    public string Name { get; set; }
    public string Description { get; set; }

    public EventRepeatEnum RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public EventTypeEnum Type { get; set; }
}

public class CompleteEventViewModel {
    [NotDefault]
    public int Id { get; set; }
}