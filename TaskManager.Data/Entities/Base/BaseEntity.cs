using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Data.Entities;
public abstract class BaseEntity : IBaseUpdateMap {
    [Key]
    public Guid EntityId { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime CreatedDateTime { get; set; }

    public Guid CreatedById { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime ModifiedDateTime { get; set; }

    public Guid ModifiedById { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("CreatedById")]
    public virtual TmUser CreatedBy { get; set; }

    [ForeignKey("ModifiedById")]
    public virtual TmUser ModifiedBy { get; set; }
}
