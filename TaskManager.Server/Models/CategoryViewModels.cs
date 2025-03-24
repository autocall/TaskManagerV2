using System.ComponentModel.DataAnnotations;
using TaskManager.Server.Infrastructure;

namespace TaskManager.Server.Models;

public class CreateCategoryViewModel {
    [Required, MinLength(2)]
    public string Name { get; set; }
    [NotDefault]
    public int Color { get; set; }
}

public class UpdateCategoryViewModel {
    [NotDefault]
    public int Id { get; set; }
    [Required]
    [MinLength(2), MaxLength(64)]
    public string Name { get; set; }
    [NotDefault]
    public int Color { get; set; }
}

public class UpdateCategoryOrderViewModel {
    [NotDefault]
    public int Id { get; set; }
    /// <summary>
    ///     +1 / -1 </summary>
    [NotDefault]
    [AllowedValues(-1, 1)]
    public int Order { get; set; }
}