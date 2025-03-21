﻿using System.ComponentModel.DataAnnotations;
using TaskManager.Logic.Enums;

namespace TaskManager.Server.Models;

public class CreateCommentViewModel {
    [Required]
    public DateOnly Date { get; set; }
    [Required]
    public decimal WorkHours { get; set; }
    [Required]
    public string Text { get; set; }
    [Required]
    public int TaskId { get; set; }
    [Required]
    public TaskStatusEnum Status { get; set; }
}

public class UpdateCommentViewModel {
    [Required]
    public int Id { get; set; }

    [Required]
    public DateOnly Date { get; set; }
    [Required]
    public decimal WorkHours { get; set; }
    [Required]
    public string Text { get; set; }
    [Required]
    public int TaskId { get; set; }
    [Required]
    public TaskStatusEnum Status { get; set; }
}