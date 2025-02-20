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
[Route("Api/Project/[action]")]
public class ApiProjectController : BaseController {

    private ProjectService Service => Host.GetService<ProjectService>();

    #region [ .ctor ]

    public ApiProjectController(ServicesHost host) : base(host) { }

    #endregion [ .ctor ]

    [HttpGet]
    public async Task<ActionResult> GetAll() {
        var dtos = await this.Service.GetAllAsync();
        return JsonSuccess(dtos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> Get(int id) {
        var dto = await this.Service.GetAsync(id);
        return JsonSuccess(dto);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateProjectViewModel model) {
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        var inputDto = Mapper.Map<CreateProjectDto>(model);
        var outputDto = await this.Service.CreateAsync(inputDto, base.GetUserId());
        return JsonSuccess(outputDto);
    }

    [HttpPut]
    public async Task<ActionResult> Update([FromBody] UpdateProjectViewModel model) {
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        var inputDto = Mapper.Map<UpdateProjectDto>(model);
        var outputDto = await this.Service.UpdateAsync(inputDto, base.GetUserId());
        return JsonSuccess(outputDto);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id) {
#if DEBUG || TEST
        var dto = await this.Service.GetAsync(id);
        if (dto.Name.StartsWith("Test ")) {
            var temp = await this.Service.DeletePermanentAsync(id, base.GetUserId());
            return JsonSuccess(temp);
        }
#endif
        var result = await this.Service.DeleteAsync(id, base.GetUserId());
        return JsonSuccess(result);
    }
}