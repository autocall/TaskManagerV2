
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using System;
using TaskManager.Common.Extensions;

namespace TaskManager.Server.Infrastructure;
public class ErrorFromHeaderMiddleware {
    private readonly RequestDelegate _next;

    public ErrorFromHeaderMiddleware(RequestDelegate next) {
        _next = next;
    }

    public async Task Invoke(HttpContext context) {
        if (context.Request.Headers.TryGetValue("error", out var errorMessage)) {
            throw new ErrorFromHeaderException(errorMessage.ToString());
        }
        if (context.Request.Headers.TryGetValue("errors", out var errorsJson)) {
            // Example: {"Name":"Name Error"}
            var errors = JsonExtension.Deserialize<Dictionary<string, string>>(errorsJson);
            throw new ErrorsFromHeaderException(errors);
        }

        await _next(context);
    }
}

public class ErrorFromHeaderException : Exception {
    public ErrorFromHeaderException(string message) : base(message) { }
}
public class ErrorsFromHeaderException : Exception {
    public Dictionary<string, string> Errors { get; set; }
    public ErrorsFromHeaderException(Dictionary<string, string> errors) {
        Errors = errors;
    }
}