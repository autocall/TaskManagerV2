using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Data.Entities;
public abstract class BaseEntity : IBaseUpdateMap {
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int Id { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime CreatedDateTime { get; set; }

    public virtual int CreatedById { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime ModifiedDateTime { get; set; }

    public virtual int ModifiedById { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("CreatedById")]
    public virtual TmUser CreatedBy { get; set; }

    [ForeignKey("ModifiedById")]
    public virtual TmUser ModifiedBy { get; set; }
}

public interface IBaseUpdateMap {
    DateTime ModifiedDateTime { get; set; }
    int ModifiedById { get; set; }
}
