using System.ComponentModel.DataAnnotations.Schema;
using TaskManager.Data.Context;

namespace TaskManager.Data.Entities;
public class Category : BaseEntity, ICategoryUpdateMap, ICategoryOrderUpdateMap {
    /// <summary>
    ///     Name </summary>
    /// <see cref="TmDbContext">remarks</see>
    [Column(TypeName = "nvarchar(64)")]
    public string Name { get; set; }
    public int Color { get; set; }
    public byte Order { get; set; }
}

public interface ICategoryUpdateMap : IBaseUpdateMap {
    public string Name { get; set; }
    public int Color { get; set; }
}

public interface ICategoryOrderUpdateMap : IBaseUpdateMap {
    public byte Order { get; set; }
}