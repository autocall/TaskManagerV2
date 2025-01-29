namespace TaskManager.Data.Entities;
public interface IBaseUpdateMap {
    DateTime ModifiedDateTime { get; set; }
    Guid ModifiedById { get; set; }
}
