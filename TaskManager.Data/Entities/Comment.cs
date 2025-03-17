using System.ComponentModel.DataAnnotations.Schema;
using TaskManager.Data.Context;

namespace TaskManager.Data.Entities;
public class Comment : BaseCompanyEntity, ICommentUpdateMap {
    [Column(TypeName = "smalldatetime")]
    public DateTime DateTime { get; set; }
    public int TaskId { get; set; }
    /// <summary>
    ///     Name </summary>
    /// <see cref="TmDbContext">remarks</see>
    [Column(TypeName = "nvarchar(max)")]
    public string Text { get; set; }
    [Column(TypeName = "decimal(9,1)")]
    public decimal WorkHours { get; set; }

    [ForeignKey("TaskId")]
    public Task1 Task { get; set; }
}

public interface ICommentUpdateMap : IBaseUpdateMap {
    public DateTime DateTime { get; set; }
    public int TaskId { get; set; }
    public string Text { get; set; }
    public decimal WorkHours { get; set; }
}