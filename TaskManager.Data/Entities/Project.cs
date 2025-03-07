using System.ComponentModel.DataAnnotations.Schema;
using TaskManager.Data.Context;

namespace TaskManager.Data.Entities;
public class Project : BaseCompanyEntity, IProjectUpdateMap {
    /// <summary>
    ///     Name </summary>
    /// <see cref="TmDbContext">remarks</see>
    [Column(TypeName = "nvarchar(64)")]
    public string Name { get; set; }
}

public interface IProjectUpdateMap : IBaseUpdateMap {
    public string Name { get; set; }
}