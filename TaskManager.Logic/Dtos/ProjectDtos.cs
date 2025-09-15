using TaskManager.Logic.Enums;

namespace TaskManager.Logic.Dtos;
public interface IEnumProjectDtoMap {
    public TaskColumnEnum DefaultColumn { get; set; }
}

public class ProjectDto : BaseCompanyDto, IEnumProjectDtoMap {
    public string Name { get; set; }
    public TaskColumnEnum DefaultColumn { get; set; }
    public string GitHubRepo { get; set; }
}

public class CreateProjectDto : IEnumProjectDtoMap {
    public string Name { get; set; }
    public TaskColumnEnum DefaultColumn { get; set; }
    public string GitHubRepo { get; set; }
}

public class UpdateProjectDto : IEnumProjectDtoMap {
    public int Id { get; set; }

    public string Name { get; set; }
    public TaskColumnEnum DefaultColumn { get; set; }
    public string GitHubRepo { get; set; }
}