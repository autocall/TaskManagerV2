using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using TaskManager.Common.Exceptions;
using TaskManager.Common.Extensions;
using TaskManager.Data.Entities;
using TaskManager.Data.Enums;
using TaskManager.Data.Helpers;
using TaskManager.Logic;
using TaskManager.Logic.Dtos.Identity;
using TaskManager.Logic.Services;
using TaskManager.Server.Models;

namespace TaskManager.Server.Controllers;
[Authorize]
[ApiController]
[Route("Api/Profile/[action]")]
public class ApiProfileController : BaseController {

    private readonly SignInManager<TmUser> SignInManager;
    private ProfileService Service => Host.GetService<ProfileService>();
    private readonly IConfiguration Config;

    #region [ .ctor ]

    public ApiProfileController(ServicesHost host, IConfiguration config, SignInManager<TmUser> signInManager) : base(host) {
        SignInManager = signInManager;
        Config = config;
    }

    #endregion [ .ctor ]

    [HttpGet]
    public async Task<ActionResult> GetTimeZones() {
        var dtos = this.Service.GetTimeZones();
        var userTimeZoneId = await this.Service.GetTimeZoneIdAsync(GetUserId());
        return JsonSuccess(new { TimeZones = dtos, TimeZoneId = userTimeZoneId });
    }

    [HttpGet]
    public async Task<ActionResult> GetTimeZone() {
        var userTimeZoneId = await this.Service.GetTimeZoneAsync(GetUserId());
        return JsonSuccess(userTimeZoneId);
    }

    [HttpPut]
    public async Task<ActionResult> SetTimeZone([FromBody] UpdateTimeZoneViewModel model) {
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        await this.Service.SetTimeZoneAsync(GetUserId(), model.TimeZoneId);

        var user = await Host.UserManager.FindByIdAsync(GetUserId().ToString());
        await SignInManager.SignInAsync(user, new AuthenticationProperties() {
            IsPersistent = true,
            ExpiresUtc = DateTime.UtcNow.AddYears(1)
        });

        var accountController = new ApiAccountController(Host, Config, SignInManager);
        return await accountController.ReturnIdentityAsync(user);
    }
}
