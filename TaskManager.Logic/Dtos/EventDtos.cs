using TaskManager.Common;
using TaskManager.Logic.Enums;

namespace TaskManager.Logic.Dtos;

public interface IEnumEventDtoMap {
    public EventRepeatEnum RepeatType { get; set; }
    public EventTypeEnum Type { get; set; }
}

public class EventDto : BaseDto, IEnumEventDtoMap, IDeepCloneable<EventDto> {
    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public EventRepeatEnum RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public EventTypeEnum Type { get; set; }

    public override EventDto Clone() {
        var dto = (EventDto)base.Clone();
        dto.Date = Date;
        dto.Name = Name;
        dto.Description = Description;
        dto.RepeatType = RepeatType;
        dto.RepeatValue = RepeatValue;
        return dto;
    }

    public EventDto Clone(DateOnly date) {
        var dto = this.Clone();
        dto.Date = date;
        return dto;
    }
}

public class CreateEventDto : IEnumEventDtoMap {
    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public EventRepeatEnum RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public EventTypeEnum Type { get; set; }
}

public class UpdateEventDto : IEnumEventDtoMap {
    public int Id { get; set; }

    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public EventRepeatEnum RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public EventTypeEnum Type { get; set; }
}