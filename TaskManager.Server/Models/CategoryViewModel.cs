using System.ComponentModel.DataAnnotations;

namespace TaskManager.Server.Models;

public class CreateCategoryViewModel {
    [Required, MinLength(2)]
    public string Name { get; set; }
    [Required]
    public int Color { get; set; }
}

public class UpdateCategoryViewModel {
    [Required]
    public int Id { get; set; }
    [Required]
    [MinLength(2), MaxLength(64)]
    public string Name { get; set; }
    [Required]
    public int Color { get; set; }
}

public class UpdateCategoryOrderViewModel {
    [Required]
    public int Id { get; set; }
    /// <summary>
    ///     +1 / -1 </summary>
    [Required]
    [AllowedValues(-1, 1)]
    public int Order { get; set; }
}