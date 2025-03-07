using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Data.Entities;
public abstract class BaseCompanyEntity : BaseEntity {
    public int CompanyId { get; set; }

    [ForeignKey("CompanyId")]
    public virtual Company Company { get; set; }
}
