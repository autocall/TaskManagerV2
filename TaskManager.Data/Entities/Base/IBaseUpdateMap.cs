namespace TaskManager.Data.Entities;
public interface IBaseUpdateMap {
    DateTime ModifiedDateTime { get; set; }
    int ModifiedById { get; set; }
}
