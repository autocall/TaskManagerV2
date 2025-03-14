namespace TaskManager.Logic.Dtos;

public class CommentDto : BaseCompanyDto {
    public int TaskId { get; set; }
    public DateTime DateTime { get; set; }
    public decimal WorkHours { get; set; }
    public string Text { get; set; }
}

public class CreateCommentDto {
    public int TaskId { get; set; }
    public DateTime DateTime { get; set; }
    public decimal WorkHours { get; set; }
    public string Text { get; set; }
}

public class UpdateCommentDto {
    public int Id { get; set; }

    public int TaskId { get; set; }
    public DateTime DateTime { get; set; }
    public decimal WorkHours { get; set; }
    public string Text { get; set; }
}