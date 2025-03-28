﻿using LinqToDB;
using TaskManager.Common;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Enums;

namespace TaskManager.Logic.Services;
public class TaskService : BaseService {
    private IRepository<Task1> Rep(int companyId) => base.Rep<Task1>(companyId);
    private IRepository<Comment> CommentRep(int companyId) => base.Rep<Comment>(companyId);

    public TaskService(ServicesHost host) : base(host) { }

    public async Task<IQueryable<Task1>> GetAllQueryAsync(FilterDto filter, int companyId) {
        IQueryable<Task1> query = Rep(companyId).GetAll(false);
        if (!string.IsNullOrWhiteSpace(filter.Text)) {
            query = query.Where(x => x.Title.Contains(filter.Text) || x.Description.Contains(filter.Text));
        }
        if (filter.Kind.HasValue) {
            query = query.Where(x => x.Kind == (byte)filter.Kind.Value);
        }
        if (filter.Status.HasValue) {
            query = query.Where(x => x.Status == (byte)filter.Status.Value);
        } else {
            query = query.Where(x => x.Status != (byte)TaskStatusEnum.Canceled && x.Status != (byte)TaskStatusEnum.Closed);
        }
        if (filter.ProjectId.HasValue) {
            query = query.Where(x => x.ProjectId == filter.ProjectId.Value);
        }
        if (filter.Date.HasValue) {
            var timeZone = await this.Host.GetService<ProfileService>().GetTimeZoneAsync(companyId);
            var dateFrom = filter.Date.Value.ToDateTime(default).AddHours(timeZone.BaseUtcOffset.TotalHours);
            var dateTo = dateFrom.AddDays(1);
            query = query.Where(x => x.CreatedDateTime >= dateFrom && x.CreatedDateTime < dateTo);
        }
        return query;
    }

    public async Task<List<TaskDto>> GetAllAsync(FilterDto filter, int companyId) {
       var query = await this.GetAllQueryAsync(filter, companyId);
        var models = await query.ToListAsync();
        return Mapper.Map<List<TaskDto>>(models);
    }

    public async Task<TaskDto> GetAsync(int id, int companyId) {
        var model = await Rep(companyId).GetByIdAsync(id);
        return Mapper.Map<TaskDto>(model);
    }

    public async Task<TaskDto> CreateAsync(CreateTaskDto dto, int userId, int companyId) {
        var model = new Task1();
        Mapper.Map(dto, model);
        model.Index = await this.GetNextIndexAsync(companyId);
        await Rep(companyId).InsertAsync(model, userId);
        return await this.GetAsync(model.Id, companyId);
    }

    private async Task<int> GetNextIndexAsync(int companyId) {
        var maxIndex = await Rep(companyId).GetAll(false).Select(x => x.Index).DefaultIfEmpty().MaxAsync();
        return maxIndex + 1;
    }

    public async Task<TaskDto> UpdateAsync(UpdateTaskDto dto, int userId, int companyId) {
        var inModel = Mapper.Map<Task1>(dto);
        await Rep(companyId).UpdateAsync<ITaskUpdateMap>(inModel, userId);
        return await this.GetAsync(dto.Id, companyId);
    }

    public async Task UpdateAsync(ITaskUpdateStatusDtoMap dto, int userId, int companyId) {
        var commentsCount = await this.CommentRep(companyId).GetAll(false).Where(e => e.TaskId == dto.TaskId).CountAsync();
        var workHours = await this.CommentRep(companyId).GetAll(false).Where(e => e.TaskId == dto.TaskId).SumAsync(x => x.WorkHours);
        var task = new Task1() {
            Id = dto.TaskId,
            WorkHours = workHours,
            CommentsCount = commentsCount,
            Status = (byte)dto.Status
        };
        await this.Rep(companyId).UpdateAsync<ITaskUpdateStatusMap>(task, userId);
    }

    public async Task UpdateStatisticAsync(int taskId, int userId, int companyId) {
        var commentsCount = await this.CommentRep(companyId).GetAll(false).Where(e => e.TaskId == taskId).CountAsync();
        var workHours = await this.CommentRep(companyId).GetAll(false).Where(e => e.TaskId == taskId).SumAsync(x => x.WorkHours);
        var task = new Task1() {
            Id = taskId,
            WorkHours = workHours,
            CommentsCount = commentsCount,
        };
        await this.Rep(companyId).UpdateAsync<ITaskUpdateStatisticMap>(task, userId);
    }

    public async Task<int> DeleteAsync(int id, int userId, int companyId) {
        return await Rep(companyId).UpdateIsDeletedAsync(id, true, userId);
    }

    public async Task<int> DeletePermanentAsync(int id, int userId, int companyId) {
        return await Rep(companyId).DeleteAsync(id);
    }
}
