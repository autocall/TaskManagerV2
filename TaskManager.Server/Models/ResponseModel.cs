namespace TaskManager.Server.Models;

public class ResponseSuccessModel { }

public class ResponseSuccessModel<T> : ResponseSuccessModel {
    public T Data { get; set; }
}
