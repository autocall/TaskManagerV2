using System.Net;

namespace TaskManager.Logic.WebServices;


public sealed class ApiResult<T>
{
    public bool Success { get; private set; }
    public T Data { get; private set; }
    public string ErrorMessage { get; private set; }
    public HttpStatusCode StatusCode { get; private set; }

    public static ApiResult<T> Successed(T data)
    {
        return new ApiResult<T>()
        {
            Success = true,
            Data = data,
            StatusCode = HttpStatusCode.OK,
        };
    }

    public static ApiResult<T> Failed(WebException e)
    {
        var response = e.Response as HttpWebResponse;
        var status = response?.StatusCode ?? HttpStatusCode.BadRequest;

        return new ApiResult<T>()
        {
            Success = false,
            Data = default,
            StatusCode = status,
            ErrorMessage = e.Message
        };
    }

    public static ApiResult<T> Failed(Exception e)
    {
        return new ApiResult<T>()
        {
            Success = false,
            Data = default,
            StatusCode = HttpStatusCode.InternalServerError,
            ErrorMessage = e.Message
        };
    }
}