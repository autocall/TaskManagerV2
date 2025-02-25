using TaskManager.Common;

namespace TaskManager.Logic.Dtos;

public abstract class BaseDto : IDeepCloneable<BaseDto> {
    public int Id { get; set; }
    public DateTime CreatedDateTime { get; set; }
    public int CreatedById { get; set; }
    public DateTime ModifiedDateTime { get; set; }
    public int ModifiedById { get; set; }
    public bool IsDeleted { get; set; }

    public virtual BaseDto Clone() {
        return (BaseDto)this.MemberwiseClone();
    }
}