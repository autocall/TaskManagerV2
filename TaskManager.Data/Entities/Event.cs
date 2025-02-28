using System.ComponentModel.DataAnnotations.Schema;
using TaskManager.Data.Context;

namespace TaskManager.Data.Entities;
public class Event : BaseEntity, IEventUpdateMap, IEventUpdateDateMap, IEnumEventMap {
    [Column(TypeName = "Date")]
    public DateOnly Date { get; set; }
    /// <summary>
    ///     Name </summary>
    /// <see cref="TmDbContext">remarks</see>
    [Column(TypeName = "nvarchar(64)")]
    public string Name { get; set; }
    /// <summary>
    ///     Description </summary>
    /// <see cref="TmDbContext">remarks</see>
    [Column(TypeName = "nvarchar(1024)")]
    public string Description { get; set; }

    public byte RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public byte Type { get; set; }
}

public interface IEnumEventMap {
    public byte RepeatType { get; set; }
    public byte Type { get; set; }
}

public interface IEventUpdateDateMap : IBaseUpdateMap {
    public DateOnly Date { get; set; }
}

public interface IEventUpdateMap : IBaseUpdateMap {
    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public byte RepeatType { get; set; }
    public short RepeatValue { get; set; }

    public byte Type { get; set; }
}