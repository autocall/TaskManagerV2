﻿using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
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
[Route("Api/Event/[action]")]
public class ApiEventController : BaseController {

    private EventService Service => Host.GetService<EventService>();

    #region [ .ctor ]

    public ApiEventController(ServicesHost host) : base(host) { }

    #endregion [ .ctor ]

    [HttpGet]
    public async Task<ActionResult> GetAll() {
        var dtos = await this.Service.GetAllAsync(base.GetCompanyId());
        return JsonSuccess(dtos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> Get(int id) {
        var dto = await this.Service.GetAsync(id, base.GetCompanyId());
        return JsonSuccess(dto);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateEventViewModel model) {
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        var inputDto = Mapper.Map<CreateEventDto>(model);
        var outputDto = await this.Service.CreateAsync(inputDto, base.GetUserId(), base.GetCompanyId());
        return JsonSuccess(outputDto);
    }

    [HttpPut]
    public async Task<ActionResult> Update([FromBody] UpdateEventViewModel model) {
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        var inputDto = Mapper.Map<UpdateEventDto>(model);
        var outputDto = await this.Service.UpdateAsync(inputDto, base.GetUserId(), base.GetCompanyId());
        return JsonSuccess(outputDto);
    }

    [HttpPut]
    public async Task<ActionResult> Complete([FromBody] CompleteEventViewModel model) {
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        var outputDto = await this.Service.CompleteAsync(model.Id, base.GetUserId(), base.GetCompanyId());
        return JsonSuccess(outputDto);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id) {
        var result = await this.Service.DeletePermanentAsync(id, base.GetUserId(), base.GetCompanyId());
        return JsonSuccess(result);
    }
}