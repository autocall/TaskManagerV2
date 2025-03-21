namespace TaskManager.Logic.Dtos;

public class ReportDto {
    public List<ReportProjectDto> Projects { get; set; }
    public decimal WorkHours { get; set; }
}

public class ReportProjectDto : ProjectDto {
    public decimal WorkHours { get; set; }
    public List<ReportTaskDto> Tasks { get; set; }
}

public class ReportTaskDto : TaskDto {
    public List<ReportCommentDto> Comments { get; set; }
}

public class ReportCommentDto : CommentDto {
}