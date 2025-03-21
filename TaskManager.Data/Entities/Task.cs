using System.ComponentModel.DataAnnotations.Schema;
using TaskManager.Data.Context;

namespace TaskManager.Data.Entities;
public class Task1 : BaseCompanyEntity, ITaskUpdateMap, ITaskUpdateStatusMap, ITaskUpdateStatisticMap, IEnumTaskMap {
    public int Index { get; set; }
    /// <summary>
    ///     Name </summary>
    /// <see cref="TmDbContext">remarks</see>
    [Column(TypeName = "nvarchar(256)")]
    public string Title { get; set; }
    /// <summary>
    ///     Name </summary>
    /// <see cref="TmDbContext">remarks</see>
    [Column(TypeName = "nvarchar(max)")]
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    public int CategoryId { get; set; }
    public byte Column { get; set; }
    public byte Kind { get; set; }
    public byte Status { get; set; }
    [Column(TypeName = "decimal(9,1)")]
    public decimal WorkHours { get; set; }
    public int CommentsCount { get; set; }

    [ForeignKey("ProjectId")]
    public Project Project { get; set; }
    [ForeignKey("CategoryId")]
    public Category Category { get; set; }
}

public interface IEnumTaskMap {
    public byte Column { get; set; }
    public byte Kind { get; set; }
    public byte Status { get; set; }
}

public interface ITaskUpdateMap : IBaseUpdateMap {
    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    public int CategoryId { get; set; }
    public byte Column { get; set; }
    public byte Kind { get; set; }
    public byte Status { get; set; }
    public decimal WorkHours { get; set; }
    public int CommentsCount { get; set; }
}

public interface ITaskUpdateStatusMap : IBaseUpdateMap {
    public byte Status { get; set; }
    public decimal WorkHours { get; set; }
    public int CommentsCount { get; set; }
}

public interface ITaskUpdateStatisticMap : IBaseUpdateMap {
    public decimal WorkHours { get; set; }
    public int CommentsCount { get; set; }

}