using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Data.Entities;
public class Project : BaseEntity {
    [Column(TypeName = "varchar(64)")]
    public string Name { get; set; }

}
