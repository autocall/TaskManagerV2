namespace TaskManager.Logic.Dtos;

public class ProjectDto : BaseCompanyDto {
    public string Name { get; set; }
}

public class CreateProjectDto {
    public string Name { get; set; }
}

public class UpdateProjectDto {
    public int Id { get; set; }

    public string Name { get; set; }
}