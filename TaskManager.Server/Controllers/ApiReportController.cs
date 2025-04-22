using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using TaskManager.Common.Extensions;
using TaskManager.Data.Entities;
using TaskManager.Data.Enums;
using TaskManager.Logic.Dtos.Identity;
using TaskManager.Logic.Services;
using TaskManager.Logic;
using TaskManager.Server.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Components.Forms;
using TaskManager.Logic.Dtos;

namespace TaskManager.Server.Controllers;
[Authorize]
[ApiController]
[Route("Api/Report/[action]")]
public class ApiReportController : BaseController {

    private ReportService Service => Host.GetService<ReportService>();

    #region [ .ctor ]

    public ApiReportController(ServicesHost host) : base(host) { }

    #endregion [ .ctor ]

    [HttpGet]
    public async Task<ActionResult> GetByDate([Required] DateOnly date) {
#if DEBUG
        await Task.Delay(TimeSpan.FromSeconds(0.5));
#endif
        var dto = await this.Service.GetAsync(date, base.GetUserId(), base.GetCompanyId());
        return JsonSuccess(dto);
    }

    [HttpGet]
    public async Task<ActionResult> GetByRange([Required] DateOnly dateFrom, [Required] DateOnly dateTo) {
#if DEBUG
        await Task.Delay(TimeSpan.FromSeconds(0.5));
#endif
        if (dateFrom > dateTo) {
            var tmp = dateFrom;
            dateFrom = dateTo;
            dateTo = tmp;
        }
        var dto = await this.Service.GetAsync(dateFrom, dateTo, base.GetUserId(), base.GetCompanyId());
        return JsonSuccess(dto);
    }
}