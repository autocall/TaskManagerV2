﻿using Microsoft.AspNetCore.Authentication;
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
using Microsoft.VisualBasic;

namespace TaskManager.Server.Controllers;
[Authorize]
[ApiController]
[Route("Api/Calendar/[action]")]
public class ApiCalendarController : BaseController {

    private CalendarService Service => Host.GetService<CalendarService>();

    #region [ .ctor ]

    public ApiCalendarController(ServicesHost host) : base(host) { }

    #endregion [ .ctor ]

    [HttpGet]
    public async Task<ActionResult> GetYear(DayOfWeek firstDayOfWeek) {
#if DEBUG
        await Task.Delay(TimeSpan.FromSeconds(0.1));
#endif
        var dtos = await this.Service.GetYearAsync(firstDayOfWeek);
        return JsonSuccess(dtos);
    }

    [HttpGet]
    public async Task<ActionResult> GetCurrent(DayOfWeek firstDayOfWeek) {
#if DEBUG
        await Task.Delay(TimeSpan.FromSeconds(0.1));
#endif
        var dto = await this.Service.GetCurrentAsync(firstDayOfWeek);
        return JsonSuccess(dto);
    }
}