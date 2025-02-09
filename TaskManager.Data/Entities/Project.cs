using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Data.Entities;
public class Project : BaseEntity, IProjectUpdateMap {
    [Column(TypeName = "varchar(64)")]
    public string Name { get; set; }
}

public interface IProjectUpdateMap : IBaseUpdateMap {
    public string Name { get; set; }
}