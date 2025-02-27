﻿namespace TaskManager.Logic.Dtos;

public class ProjectDto : BaseDto {
    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public int RepeatType { get; set; }
    public int RepeatValue { get; set; }

    public bool Birthday { get; set; }
    public bool Holiday { get; set; }
}

public class CreateProjectDto {
    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public int RepeatType { get; set; }
    public int RepeatValue { get; set; }

    public bool Birthday { get; set; }
    public bool Holiday { get; set; }
}

public class UpdateProjectDto {
    public int Id { get; set; }

    public DateOnly Date { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public int RepeatType { get; set; }
    public int RepeatValue { get; set; }

    public bool Birthday { get; set; }
    public bool Holiday { get; set; }
}