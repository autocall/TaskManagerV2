using System.ComponentModel.DataAnnotations;

namespace TaskManager.Server.Models;

public class CreateEventViewModel {
    [Required]
    public DateOnly Date { get; set; }
    [Required, MinLength(2)]
    public string Name { get; set; }
    public string Description { get; set; }

    public int RepeatType { get; set; }
    public int RepeatValue { get; set; }

    public bool Birthday { get; set; }
    public bool Holiday { get; set; }
}

public class UpdateEventViewModel {
    [Required]
    public int Id { get; set; }
    [Required]
    public DateOnly Date { get; set; }
    [Required, MinLength(2)]
    public string Name { get; set; }
    public string Description { get; set; }

    public int RepeatType { get; set; }
    public int RepeatValue { get; set; }

    public bool Birthday { get; set; }
    public bool Holiday { get; set; }
}