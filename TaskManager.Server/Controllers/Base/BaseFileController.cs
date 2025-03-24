using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
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
public abstract class BaseFileController : BaseController {

    private IFileService Service => Host.GetService<CachedFileService>();

    #region [ .ctor ]

    public BaseFileController(ServicesHost host) : base(host) { }

    #endregion [ .ctor ]

    protected async Task SaveFilesAsync(List<IFormFile> files, int id) {
        if (files == null) return;
        foreach (var file in files) {
            if (file.Length == 0) continue;

            var fileDto = new FileDto {
                Id = id,
                CompanyId = GetCompanyId(),
                FileName = file.FileName,
                Stream = file.OpenReadStream()
            };

            await Service.CreateAsync(fileDto);
        }
    }

    protected async Task DeleteFilesAsync(int companyId, int id) {
        await Service.DeleteAsync(companyId, id);
    }

    protected async Task DeleteFilesAsync(List<string> fileNames, int id) {
        if (fileNames != null) {
            foreach (var fileName in fileNames) {
                await Service.DeleteAsync(GetCompanyId(), id, fileName);
            }
        }
    }

    protected async Task<List<FileDto>> GetFilesAsync(int companyId, int id) {
        return await Service.GetAsync(companyId, id);
    }
}