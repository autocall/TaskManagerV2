using Microsoft.AspNetCore.Diagnostics;
using System.Net;
using TaskManager.Common.Exceptions;
using TaskManager.Common.Extensions;
using TaskManager.Common;

namespace TaskManager.Server.Infrastructure;

public class ExceptionHandler : IExceptionHandler {
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken) {
        if (exception is InfoException == false) {
            _l.e("ExceptionHandler", exception);
        }
        httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
        httpContext.Response.ContentType = "application/json";
        var result = JsonExtension.Serialize(new { error = exception.Message });
        await httpContext.Response.WriteAsync(result);
        return false;
    }
}
