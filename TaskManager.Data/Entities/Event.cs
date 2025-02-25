using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Data.Entities;
public class Event : BaseEntity, IEventUpdateMap, IEnumEventMap {
    [Column(TypeName = "Date")]
    public DateOnly Date { get; set; }
    [Column(TypeName = "varchar(64)")]
    public string Name { get; set; }
    [Column(TypeName = "varchar(1024)")]
    public string Description { get; set; }

    public byte RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public byte Type { get; set; }
}

public interface IEnumEventMap {
    public byte RepeatType { get; set; }
    public byte Type { get; set; }
}

public interface IEventUpdateMap : IBaseUpdateMap {
    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public byte RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public byte Type { get; set; }
}