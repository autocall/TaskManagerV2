namespace TaskManager.Logic.Dtos;

public class EventDto : BaseDto {
    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public byte RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public bool Birthday { get; set; }
    public bool Holiday { get; set; }
}

public class CreateEventDto {
    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public byte RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public bool Birthday { get; set; }
    public bool Holiday { get; set; }
}

public class UpdateEventDto {
    public int Id { get; set; }

    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public byte RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public bool Birthday { get; set; }
    public bool Holiday { get; set; }
}