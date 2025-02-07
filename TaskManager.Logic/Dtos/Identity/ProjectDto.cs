namespace TaskManager.Logic.Dtos.Identity;

public class ProjectDto : BaseDto {
    public string Name { get; set; }
}

public class CreateProjectDto {
    public string Name { get; set; }
}

public class UpdateProjectDto {
    public int Id { get; set; }
    public string Name { get; set; }
}