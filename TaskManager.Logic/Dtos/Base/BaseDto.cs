namespace TaskManager.Logic.Dtos;
public abstract class BaseDto {
    public Guid EntityId { get; set; }
    public DateTime CreatedDateTime { get; set; }
    public Guid CreatedById { get; set; }
    public DateTime ModifiedDateTime { get; set; }
    public Guid ModifiedById { get; set; }
    public bool IsDeleted { get; set; }
}
