using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using TaskManager.Logic;
using TaskManager.Logic.Services;
using TaskManager.Server.Controllers;

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
    public async Task<ActionResult> Get() {
        var data = await this.Service.GetAsync(base.GetCompanyId());
        return JsonSuccess(new { data.categories, data.projects, data.tasks, data.comments, data.users });
    }
}