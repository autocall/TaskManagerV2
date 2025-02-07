using System.ComponentModel.DataAnnotations;

namespace TaskManager.Server.Models;

public class CreateProjectViewModel {
    [Required, MinLength(2)]
    public string Name { get; set; }
}

public class UpdateProjectViewModel {
    [Required]
    public int Id { get; set; }
    [Required, MinLength(2)]
    public string Name { get; set; }
}

