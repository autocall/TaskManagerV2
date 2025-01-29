using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using TaskManager.Common.Extensions;
using TaskManager.Logic;
using TaskManager.Server.Extensions;

namespace TaskManager.Server.Controllers;

public abstract class BaseController : Controller {

    protected readonly ServicesHost Host;
    protected IMapper Mapper => Host.Mapper;

    protected BaseController(ServicesHost host) {
        this.Host = host;
    }

    private ActionResult Result(HttpStatusCode statusCode, string json) => new ContentResult {
        StatusCode = (int)statusCode,
        Content = json,
        ContentType = "application/json"
    };

    private ActionResult Result(HttpStatusCode statusCode) => new ContentResult {
        StatusCode = (int)statusCode,
        ContentType = "application/json"
    };

    protected virtual ActionResult JsonSuccess() {
        return Result(HttpStatusCode.OK);
    }

    protected virtual ActionResult JsonSuccess(object data) {
        return JsonSuccess(JsonExtension.Serialize(data));
    }
    protected virtual ActionResult JsonSuccess(string json) {
        return Result(HttpStatusCode.OK, json);
    }

    protected virtual ActionResult JsonFail(Exception exception) {
        return JsonFail(exception.GetBaseException().Message);
    }

    protected virtual ActionResult JsonFail(string error) {
        return JsonFail(HttpStatusCode.InternalServerError, error);
    }

    protected virtual ActionResult JsonFail(HttpStatusCode statusCode, Exception exception) {
        return JsonFail(statusCode, exception.GetBaseException().Message);
    }

    protected virtual ActionResult JsonFail(HttpStatusCode statusCode, string error) {
        return Result(statusCode, JsonExtension.Serialize(new { error }));
    }

    protected virtual ActionResult JsonFail(HttpStatusCode statusCode, Dictionary<string, string> errors) {
        return Result(statusCode, JsonExtension.Serialize(new { errors }));
    }

    protected virtual ActionResult JsonFail(Dictionary<string, string> errors) {
        return JsonFail(HttpStatusCode.InternalServerError, errors);
    }

    /// <summary>
    ///     Converts ModelState to FieldName:Error </summary>
    protected Dictionary<string, string> GetErrors() {
        if (ModelState == null) {
            return null;
        }
        var errorModels = Mapper.Map<Dictionary<string, string>>(ModelState);
        return errorModels;
    }

    protected Guid GetUserId() => base.User.GetUserId();
}
