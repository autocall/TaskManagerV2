using TaskManager.Logic.Enums;

namespace TaskManager.Logic.Dtos;
public class FilterDto {
    public string Text { get; set; }
    public TaskKindEnum? Kind { get; set; }
    public TaskStatusEnum? Status { get; set; }
    public int? ProjectId { get; set; }
    public DateOnly? Date { get; set; }
}
