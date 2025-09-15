using System.ComponentModel.DataAnnotations.Schema;
using TaskManager.Data.Context;

namespace TaskManager.Data.Entities;
public class Project : BaseCompanyEntity, IProjectUpdateMap, IEnumProjectMap {
    /// <summary>
    ///     Name </summary>
    /// <see cref="TmDbContext">remarks</see>
    [Column(TypeName = "nvarchar(64)")]
    public string Name { get; set; }
    public byte DefaultColumn { get; set; }
    public string GitHubRepo { get; set; }
}

public interface IProjectUpdateMap : IBaseUpdateMap {
    public string Name { get; set; }
    public byte DefaultColumn { get; set; }
    public string GitHubRepo { get; set; }
}

public interface IEnumProjectMap {
    public byte DefaultColumn { get; set; }
}
