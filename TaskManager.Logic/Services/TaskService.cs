﻿using LinqToDB;
using System.Linq;
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
        } else if (filter.Date.HasValue == false) {
            query = query.Where(x => x.Status != (byte)TaskStatusEnum.Canceled && x.Status != (byte)TaskStatusEnum.Closed);
        }
        if (filter.ProjectId.HasValue) {
            query = query.Where(x => x.ProjectId == filter.ProjectId.Value);
        }
        if (filter.Date.HasValue) {
            var timeZone = await this.Host.GetService<ProfileService>().GetTimeZoneAsync(companyId);
            var dateFrom = filter.Date.Value.ToDateTime(default).AddHours(timeZone.BaseUtcOffset.TotalHours);
            var dateTo = dateFrom.AddDays(1);
            var commentsSubQuery = CommentRep(companyId).GetAll(false).Where(x => x.Date == filter.Date.Value).Select(x => x.TaskId);
            query = query.Where(x => (x.CreatedDateTime >= dateFrom && x.CreatedDateTime < dateTo) || commentsSubQuery.Contains(x.Id));
        }
        return query;
    }

    public async Task<List<TaskDto>> GetAllAsync(FilterDto filter, int companyId) {
        var query = await this.GetAllQueryAsync(filter, companyId);
        var models = await query.ToListAsync();
        var dtos = Mapper.Map<List<TaskDto>>(models.OrderByDescending(x => x.Order).ThenByDescending(x => x.Index));
        return dtos;
    }

    public async Task<TaskDto> GetAsync(int id, int companyId) {
        var model = await Rep(companyId).GetByIdAsync(id);
        return Mapper.Map<TaskDto>(model);
    }

    public async Task<TaskDto> CreateAsync(CreateTaskDto dto, int userId, int companyId) {
        var model = new Task1();
        Mapper.Map(dto, model);
        model.Index = await this.GetNextIndexAsync(companyId);
        model.Order = await this.GetNextOrderAsync(dto.CategoryId, dto.Column, companyId);
        await Rep(companyId).InsertAsync(model, userId);
        return await this.GetAsync(model.Id, companyId);
    }

    private async Task<int> GetNextIndexAsync(int companyId) {
        var maxIndex = await Rep(companyId).GetAll(false).Select(x => x.Index).DefaultIfEmpty().MaxAsync();
        return maxIndex + 1;
    }

    private async Task<short> GetNextOrderAsync(int categoryId, TaskColumnEnum column, int companyId) {
        var maxOrder = await Rep(companyId).GetAll(false)
            .Where(x => x.CategoryId == categoryId && x.Column == (byte)column)
            .Select(x => (int?)x.Order)
            .DefaultIfEmpty()
            .MaxAsync() ?? 0;
        return (short)(maxOrder + 1);
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

    private async Task<short?> MoveAsync(int taskId, int userId, int companyId, bool moveUp) {
        // Loads the task to be moved
        var currentModel = await this.Rep(companyId).GetAll(false).Where(e => e.Id == taskId)
            .Select(x => new Task1 {
                Id = x.Id,
                Index = x.Index,
                CategoryId = x.CategoryId,
                Column = x.Column,
                Order = x.Order
            }).FirstOrDefaultAsync();

        if (currentModel == null) {
            throw new Exception("The task was not found");
        }

        var currentOrder = currentModel.Order;

        // Selects all tasks in the same category and column
        var query = this.Rep(companyId).GetAll(false)
            .Where(x => x.CategoryId == currentModel.CategoryId && x.Column == currentModel.Column);

        short? targetOrder = moveUp ?
            await query.MaxAsync(x => (short?)x.Order) :
            await query.MinAsync(x => (short?)x.Order);

        if (targetOrder == null) {
            return null;
        }

        // Updates the current task
        currentModel.Order = (short)(moveUp ? targetOrder + 1 : targetOrder - 1);
        await Rep(companyId).UpdateAsync<ITaskUpdateOrderMap>(currentModel, userId);

        // Returns Order
        return currentModel.Order;
    }

    public async Task<short?> UpAsync(int taskId, int userId, int companyId) {
        return await MoveAsync(taskId, userId, companyId, moveUp: true);
    }

    public async Task<short?> DownAsync(int taskId, int userId, int companyId) {
        return await MoveAsync(taskId, userId, companyId, moveUp: false);
    }

    public async Task<int> DeletePermanentAsync(int id, int userId, int companyId) {
        return await Rep(companyId).DeleteAsync(id);
    }
}
