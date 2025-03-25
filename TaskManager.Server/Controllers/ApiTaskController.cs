using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using TaskManager.Common;
using TaskManager.Common.Extensions;
using TaskManager.Data.Entities;
using TaskManager.Data.Enums;
using TaskManager.Logic;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Dtos.Identity;
using TaskManager.Logic.Helpers;
using TaskManager.Logic.Services;
using TaskManager.Server.Models;

namespace TaskManager.Server.Controllers;
[Authorize]
[ApiController]
[Route("Api/Task/[action]")]
public class ApiTaskController : BaseFileController {

    private TaskService Service => Host.GetService<TaskService>();

    #region [ .ctor ]

    public ApiTaskController(ServicesHost host) : base(host) { }

    #endregion [ .ctor ]

    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] FilterViewModel filter) {
        var filterDto = Mapper.Map<FilterDto>(filter);
        var categoryDtos = await this.Service.GetAllAsync(filterDto, base.GetCompanyId());
        return JsonSuccess(categoryDtos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> Get(int id) {
        var task = await this.Service.GetAsync(id, base.GetCompanyId());
        var files = await base.GetFilesAsync(base.GetCompanyId(), id);
        return JsonSuccess(new { task, files });
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromForm] MultipartModel form) {
        var model = form.DeserializeModel<CreateTaskViewModel>();

        var validationResults = model.Validate();
        if (validationResults.Any())
            return BadRequest(validationResults);

        var inputDto = Mapper.Map<CreateTaskDto>(model);
        var outputDto = await Service.CreateAsync(inputDto, GetUserId(), GetCompanyId());
        await base.SaveFilesAsync(form.Files, outputDto.Id);

        return JsonSuccess(outputDto);
    }

    [HttpPut]
    public async Task<ActionResult> Update([FromForm] MultipartModel form) {
        var model = form.DeserializeModel<UpdateTaskViewModel>();

        var validationResults = model.Validate();
        if (validationResults.Any())
            return BadRequest(validationResults);

        var inputDto = Mapper.Map<UpdateTaskDto>(model);
        var outputDto = await this.Service.UpdateAsync(inputDto, base.GetUserId(), base.GetCompanyId());
        await base.SaveFilesAsync(form.Files, outputDto.Id);
        await base.DeleteFilesAsync(model.DeleteFileNames, outputDto.Id);

        return JsonSuccess(outputDto);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id) {
        var result = await this.Service.DeletePermanentAsync(id, base.GetUserId(), base.GetCompanyId());
        await base.DeleteFilesAsync(base.GetCompanyId(), id);

        return JsonSuccess(result);
    }
}