using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using TaskManager.Logic;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Enums;
using TaskManager.Logic.Services;
using TaskManager.Server.Controllers;
using TaskManager.Server.Models;

namespace OverviewManager.Server.Controllers;
[Authorize]
[ApiController]
[Route("Api/Overview/[action]")]
public class ApiOverviewController : BaseController {

    private OverviewService Service => Host.GetService<OverviewService>();

    #region [ .ctor ]

    public ApiOverviewController(ServicesHost host) : base(host) { }

    #endregion [ .ctor ]

    [HttpGet]
    public async Task<ActionResult> Get([FromQuery] FilterViewModel filter) {
        var filterDto = Mapper.Map<FilterDto>(filter);
        var data = await this.Service.GetAsync(filterDto, base.GetCompanyId());
        return JsonSuccess(new { data.categories, data.projects, data.tasks, data.comments, data.users, data.files });
    }
}