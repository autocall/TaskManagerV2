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

namespace TaskManager.Server.Controllers;
[Authorize]
[ApiController]
[Route("Api/Category/[action]")]
public class ApiCategoryController : BaseController {

    private CategoryService Service => Host.GetService<CategoryService>();

    #region [ .ctor ]

    public ApiCategoryController(ServicesHost host) : base(host) { }

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
    public async Task<ActionResult> Create([FromBody] CreateCategoryViewModel model) {
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        var inputDto = Mapper.Map<CreateCategoryDto>(model);
        var outputDto = await this.Service.CreateAsync(inputDto, base.GetUserId(), base.GetCompanyId());
        return JsonSuccess(outputDto);
    }

    [HttpPut]
    public async Task<ActionResult> Update([FromBody] UpdateCategoryViewModel model) {
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        var inputDto = Mapper.Map<UpdateCategoryDto>(model);
        var outputDto = await this.Service.UpdateAsync(inputDto, base.GetUserId(), base.GetCompanyId());
        return JsonSuccess(outputDto);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateOrder([FromBody] UpdateCategoryOrderViewModel model) {
        if (!ModelState.IsValid) {
            return base.JsonFail(base.GetErrors());
        }
        var inputDto = Mapper.Map<UpdateCategoryOrderDto>(model);
        var outputDto = await this.Service.UpdateOrderAsync(inputDto, base.GetUserId(), base.GetCompanyId());
        return JsonSuccess(outputDto);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id) {
#if DEBUG || TEST
        var dto = await this.Service.GetAsync(id, base.GetCompanyId());
        if (dto.Name.StartsWith("Test ")) {
            var temp = await this.Service.DeletePermanentAsync(id, base.GetUserId(), base.GetCompanyId());
            return JsonSuccess(temp);
        }
#endif
        var result = await this.Service.DeleteAsync(id, base.GetUserId(), base.GetCompanyId());
        return JsonSuccess(result);
    }
}