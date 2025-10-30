using LinqToDB;
using Newtonsoft.Json;
using TaskManager.Common.Extensions;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Enums;
using TaskManager.Logic.WebServices;

namespace TaskManager.Logic.Services;
public class CommentService : BaseService {
    private IRepository<Comment> Rep(int companyId) => base.Rep<Comment>(companyId);

    public CommentService(ServicesHost host) : base(host) { }

    public async Task<List<CommentDto>> GetAllAsync(IQueryable<int> taskIdsQuery, FilterDto filter, int companyId) {
        var query = Rep(companyId).GetAll(false)
            .Where(x => taskIdsQuery.Contains(x.TaskId));
        if (filter.Date.HasValue) {
            query = query.Where(x => x.Date == filter.Date.Value);
        }
        var models = await query.OrderBy(x => x.Date).ThenBy(x => x.CreatedDateTime).ToListAsync();
        return Mapper.Map<List<CommentDto>>(models);
    }

    public async Task<CommentDto> GetAsync(int id, int companyId) {
        var model = await Rep(companyId).GetByIdAsync(id);
        return Mapper.Map<CommentDto>(model);
    }

    public async Task<CommentViewDto> GetWithTaskAsync(int id, int companyId) {
        var commentModel = await Rep(companyId).GetByIdAsync(id);
        var indexState = await base.Rep<Task1>(companyId).GetAll(false)
            .Where(x => x.Id == commentModel.TaskId).Select(x => new { x.Index, x.Status }).FirstAsync();
        var commentViewDto = Mapper.Map<CommentViewDto>(Mapper.Map<CommentDto>(commentModel));
        commentViewDto.TaskIndex = indexState.Index;
        commentViewDto.TaskStatus = (TaskStatusEnum)indexState.Status;
        return commentViewDto;
    }

    public async Task<CommentDto> CreateAsync(CreateCommentDto dto, GitHubCommitDto commit, int userId, int companyId) {
        var model = new Comment();
        Mapper.Map(dto, model);
        Mapper.Map(commit, model);
        await Rep(companyId).InsertAsync(model, userId);
        return await this.GetAsync(model.Id, companyId);
    }

    public async Task<CommentDto> UpdateAsync(UpdateCommentDto dto, GitHubCommitDto commit, int userId, int companyId) {
        var inModel = Mapper.Map<Comment>(dto);
        Mapper.Map(commit, inModel);
        await Rep(companyId).UpdateAsync<ICommentUpdateMap>(inModel, userId);
        return await this.GetAsync(dto.Id, companyId);
    }

    public async Task<int> DeleteAsync(int id, int userId, int companyId) {
        return await Rep(companyId).UpdateIsDeletedAsync(id, true, userId);
    }

    public async Task<int> DeletePermanentAsync(int id, int userId, int companyId) {
        return await Rep(companyId).DeleteAsync(id);
    }

    public async Task<StatisticDto> GetStatisticAsync(DayOfWeek FirstDayOfWeek, int userId, int companyId) {
        var profileService = Host.GetService<ProfileService>();
        var calendarService = Host.GetService<CalendarService>();
        var now = await profileService.GetNowAsync(userId);
        var nowDate = DateOnly.FromDateTime(now);
        var firstDayOfWeek = calendarService.GetFirstDayOfWeek(nowDate, FirstDayOfWeek);
        var lastDayOfWeek = firstDayOfWeek.AddDays(7);
        var todayHours = await Rep(companyId).GetAll(false).Where(x => x.Date == nowDate).SumAsync(x => x.WorkHours);
        var weekHours = await Rep(companyId).GetAll(false).Where(x => x.Date >= firstDayOfWeek && x.Date <= lastDayOfWeek).SumAsync(x => x.WorkHours);
        return new StatisticDto() {
            TodayHours = todayHours,
            WeekHours = weekHours,
        };
    }
}
