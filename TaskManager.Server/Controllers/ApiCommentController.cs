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
using TaskManager.Logic.Services;
using TaskManager.Server.Models;

namespace TaskManager.Server.Controllers;
[Authorize]
[ApiController]
[Route("Api/Comment/[action]")]
public class ApiCommentController : BaseFileController {

    private CommentService CommentService => Host.GetService<CommentService>();
    private TaskService TaskService => Host.GetService<TaskService>();
    private GitHubService GitHubService => Host.GetService<GitHubService>();

    #region [ .ctor ]

    public ApiCommentController(ServicesHost host) : base(host) { }

    #endregion [ .ctor ]

    //[HttpGet]
    //public async Task<ActionResult> GetAll([FromQuery] FilterViewModel filter) {
    //    var filterDto = Mapper.Map<FilterDto>(filter);
    //    var categoryDtos = await this.Service.GetAllAsync(filterDto, base.GetCompanyId());
    //    return JsonSuccess(categoryDtos);
    //}

    [HttpGet("{id:int}")]
    public async Task<ActionResult> Get(int id) {
        CommentViewDto comment = await this.CommentService.GetWithTaskAsync(id, base.GetCompanyId());
        var files = await base.GetFilesAsync(base.GetCompanyId(), id);
        return JsonSuccess(new { comment, files });
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromForm] MultipartModel form) {
        var model = form.DeserializeModel<CreateCommentViewModel>();

        var validationResults = model.Validate();
        if (validationResults.Any())
            return BadRequest(validationResults);

        var inputDto = Mapper.Map<CreateCommentDto>(model);
        var gitHubCommitDto = await this.GitHubService.GetCommitAsync(model.TaskId, model.CommitHash, base.GetUserId(), base.GetCompanyId());
        var outputDto = await this.CommentService.CreateAsync(inputDto, gitHubCommitDto, base.GetUserId(), base.GetCompanyId());
        await this.TaskService.UpdateAsync(inputDto, base.GetUserId(), base.GetCompanyId());
        await base.SaveFilesAsync(form.Files, outputDto.Id);
        return JsonSuccess(outputDto);
    }

    [HttpPut]
    public async Task<ActionResult> Update([FromForm] MultipartModel form) {
        var model = form.DeserializeModel<UpdateCommentViewModel>();

        var validationResults = model.Validate();
        if (validationResults.Any())
            return BadRequest(validationResults);

        var inputDto = Mapper.Map<UpdateCommentDto>(model);
        var gitHubCommitDto = await this.GitHubService.GetCommitAsync(model.TaskId, model.CommitHash, base.GetUserId(), base.GetCompanyId());
        var outputDto = await this.CommentService.UpdateAsync(inputDto, gitHubCommitDto, base.GetUserId(), base.GetCompanyId());
        await this.TaskService.UpdateAsync(inputDto, base.GetUserId(), base.GetCompanyId());
        await base.SaveFilesAsync(form.Files, outputDto.Id);
        await base.DeleteFilesAsync(model.DeleteFileNames, outputDto.Id);
        return JsonSuccess(outputDto);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id) {
        var dto = await this.CommentService.GetAsync(id, base.GetCompanyId());
        var result = await this.CommentService.DeletePermanentAsync(dto.Id, base.GetUserId(), base.GetCompanyId());
        await this.TaskService.UpdateStatisticAsync(dto.TaskId, base.GetUserId(), base.GetCompanyId());
        await base.DeleteFilesAsync(base.GetCompanyId(), id);
        return JsonSuccess(result);
    }
}