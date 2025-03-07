using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Data.Entities;
public class Company : BaseEntity {
    [NotMapped]
    public override int CreatedById { get; set; }
    [NotMapped]
    public override int ModifiedById { get; set; }
    [NotMapped]
    public override TmUser CreatedBy { get; set; }
    [NotMapped]
    public override TmUser ModifiedBy { get; set; }

    public static int SystemCompanyId = 1000;
}