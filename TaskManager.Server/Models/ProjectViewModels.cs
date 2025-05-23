﻿using System.ComponentModel.DataAnnotations;
using TaskManager.Logic.Enums;
using TaskManager.Server.Infrastructure;

namespace TaskManager.Server.Models;

public class CreateProjectViewModel {
    [Required, MinLength(2)]
    public string Name { get; set; }
    [NotDefault]
    public TaskColumnEnum DefaultColumn { get; set; }
}

public class UpdateProjectViewModel {
    [NotDefault]
    public int Id { get; set; }
    [Required]
    [MinLength(2), MaxLength(64)]
    public string Name { get; set; }
    [NotDefault]
    public TaskColumnEnum DefaultColumn { get; set; }

}