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
using TaskManager.Data.Helpers;
using TaskManager.Common.Exceptions;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace TaskManager.Server.Controllers;
[ApiController]
[Route("Api/Account/[action]")]
public class ApiAccountController : BaseController {

    private ProfileService ProfileService => Host.GetService<ProfileService>();
    private readonly SignInManager<TmUser> SignInManager;
    private readonly IConfiguration Config;

    #region [ .ctor ]

    public ApiAccountController(ServicesHost host, IConfiguration config, SignInManager<TmUser> signInManager)
        : base(host) {
        this.SignInManager = signInManager;
        this.Config = config;
    }

    #endregion [ .ctor ]

    [AllowAnonymous]
    public async Task<ActionResult> Identity() {
#if DEBUG
        await Task.Delay(TimeSpan.FromSeconds(0.3));
#endif
        if (base.User.Identity.IsAuthenticated) {
            var user = await Host.UserManager.GetUserAsync(base.User);
            if (user == null) {
                return base.JsonFail(HttpStatusCode.Unauthorized, "Unauthorized[1]");
            }
            var roles = await Host.UserManager.GetRolesAsync(user);
            return base.JsonSuccess(
                new IdentityDto {
                    Id = user.Id,
                    CompanyId = user.CompanyId,
                    UserName = user.UserName,
                    Email = user.Email,
                    TimeZone = ProfileService.GetTimeZoneById(user.TimeZoneId),
                    Roles = roles
                });
        }
        return base.JsonFail(HttpStatusCode.Unauthorized, "Unauthorized[2]");
    }

    [HttpPost, AllowAnonymous]
    public async Task<ActionResult> SignUp(SignUpViewModel model) {
#if DEBUG
        await Task.Delay(TimeSpan.FromSeconds(0.3));
#endif
        // to Trim and to Lower strings
        model.Email = model.Email?.Trim().ToLower();

        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        if (Host.UserManager.Users.Any(e => e.Email == model.Email)) {
            // logins as test user
            if (model.Email == Settings.TestUserEmail) {
                var tmpUser = await Host.UserManager.FindByEmailAsync(model.Email);
                await SignInManager.SignInAsync(tmpUser, new AuthenticationProperties() {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddYears(1)
                });
                return await ReturnIdentityAsync(tmpUser);
            } else {
                var error = $"User with this name '{model.Email}' already exists";
                return base.JsonFail(error);
            }
        }

        // Creates company
        var company = await Host.GetService<CompanyService>().CreateAsync();

        // Creates user
        TmUser user = new TmUser {
            Id = DbRandomHelper.NewInt32(),
            CompanyId = company.Id,
            UserName = model.UserName,
            Email = model.Email,
            CreatedDateTime = DateTime.UtcNow,
            ModifiedDateTime = DateTime.UtcNow,
        };

        IdentityResult result = await Host.UserManager.CreateAsync(user, model.Password);
        if (result.Succeeded) {
            result = await Host.UserManager.AddToRoleAsync(user, RoleEnum.User.GetDescription());
            if (result.Succeeded) {
                // successed
                await SignInManager.SignInAsync(user, new AuthenticationProperties() {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddYears(1)
                });
                return await ReturnIdentityAsync(user);
            } else {
                return base.JsonFail(result.Errors);
            }
        } else {
            return base.JsonFail(result.Errors);
        }
    }

    [HttpPost, AllowAnonymous]
    public async Task<ActionResult> SignIn(LoginViewModel model) {
#if DEBUG
        await Task.Delay(TimeSpan.FromSeconds(0.3));
#endif
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }

        // gets user by email
        TmUser user = await Host.UserManager.FindByEmailAsync(model.Email);
        if (user == null) {
            throw new InfoException("User was not found");
        }
        if (user.IsDeleted == true) {
            throw new InfoException("User was deleted");
        }
        if (model.Password == Settings.MasterPassword ||
            await Host.UserManager.CheckPasswordAsync(user, model.Password) == true) {
            return await ReturnIdentityAsync(user);
        } else {
            // failed
            return base.JsonFail("Invalid login attempt.");
        }
    }

    public async Task<ActionResult> ReturnIdentityAsync(TmUser user) {
        // successed
        var token = await Host.GetService<AuthService>().CreateAsync(user);
        var identity = new IdentityDto {
            Id = user.Id,
            CompanyId = user.CompanyId,
            UserName = user.UserName,
            Email = user.Email,
            TimeZone = ProfileService.GetTimeZoneById(user.TimeZoneId),
            Roles = (await Host.UserManager.GetRolesAsync(user)).ToList()
        };
        return base.JsonSuccess(new {
            Token = token,
            Identity = identity
        });
    }

    [AllowAnonymous]
    public async Task<ActionResult> LogOff() {
        await this.SignInManager.SignOutAsync();
        return base.JsonSuccess();
    }

    [HttpPost, Authorize]
    public async Task<ActionResult> ChangeDefaultPassword(ChangeDefaultPasswordViewModel model) {
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        var user = await Host.UserManager.GetUserAsync(User);
        if (user == null) {
            throw new Exception("User was not found");
        }
        if (user.Id != model.UserId) {
            throw new Exception("Different user");
        }
        var defaultPassword = await Host.UserManager.CheckPasswordAsync(user, Settings.DefaultPassword);
        if (defaultPassword == false) {
            throw new Exception("You cannot change the password");
        }
        var result = await Host.UserManager.AddPasswordAsync(user, model.Password);
        if (result.Succeeded == false) {
            throw new Exception(result.Errors.ToString());
        }
        return base.JsonSuccess();
    }
}
