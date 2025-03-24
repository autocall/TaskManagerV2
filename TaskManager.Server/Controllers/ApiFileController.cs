using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.Design;
using System.Diagnostics;
using TaskManager.Common.Extensions;
using TaskManager.Data.Entities;
using TaskManager.Data.Enums;
using TaskManager.Logic;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Dtos.Identity;
using TaskManager.Logic.Helpers;
using TaskManager.Logic.Services;
using TaskManager.Server.Helpers;
using TaskManager.Server.Models;

namespace TaskManager.Server.Controllers;
[AllowAnonymous]
[ApiController]
[Route("Api/File")]
public class ApiFileController : BaseController {

    private IFileService Service => Host.GetService<CachedFileService>();

    #region [ .ctor ]

    public ApiFileController(ServicesHost host) : base(host) { }

    #endregion [ .ctor ]

    [HttpGet("{companyId:int}/{id:int}")]
    public async Task<ActionResult> GetAll(int companyId, int id) {
        List<FileDto> files = await Service.GetAsync(companyId, id);
        return JsonSuccess(files);
    }

    [HttpGet("{companyId:int}/{id:int}/{fileName}")]
    public async Task<ActionResult> Get(int companyId, int id, string fileName) {
        var stream = await Service.ReadAsync(companyId, id, fileName);
        if (stream == null) return NotFound();
        var extension = Path.GetExtension(fileName);
        Response.Headers["Content-Disposition"] = $"inline; filename=\"{fileName}\"";
        return File(stream, MimeTypeHelper.GetMimeType(extension));
    }
}