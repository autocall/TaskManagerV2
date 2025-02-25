using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TaskManager.Common;
using TaskManager.Common.Extensions;
using TaskManager.Data;
using TaskManager.Data.Entities;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Enums;

namespace TaskManager.Logic.Services;
public class EventService : BaseService {
    private Repository<Event> Rep => UnitOfWork.GetRepository<Event>();

    public EventService(ServicesHost host) : base(host) { }

    public async Task<List<EventDto>> GetAllAsync() {
        var models = await Rep.GetAll(false).ToListAsync();
        return Mapper.Map<List<EventDto>>(models);
    }

    public async Task<List<EventDto>> GetRangeAsync(DateOnly startDate, DateOnly endDate) {
        var models = await Rep.GetAll(false).ToListAsync();
        var dtos = Mapper.Map<List<EventDto>>(models);
        return this.GenerateRange(dtos, startDate, endDate).ToList();
    }

    private IEnumerable<EventDto> GenerateRange(List<EventDto> events, DateOnly startDate, DateOnly endDate) {
        foreach (var e in events) {
            var tm = e.Clone();
            if (e.RepeatType != EventRepeatEnum.Default && e.RepeatValue <= 0) {
                var error = "Repeat value should be greater than 0";
                e.Clone();
                e.Description = error;
                _l.e(error);
                yield return e;
                continue;
            }
            switch (e.RepeatType) {
                case EventRepeatEnum.Default:
                    if (e.Date >= startDate && e.Date <= endDate) {
                        yield return e;
                    }
                    break;
                case EventRepeatEnum.Days:
                    for (var date = e.Date; date <= endDate; date = date.AddDays(e.RepeatValue)) {
                        if (date >= startDate) {
                            var clone = e.Clone();
                            clone.Date = date;
                            yield return clone;
                        }
                    }
                    break;
                case EventRepeatEnum.Weeks:
                    for (var date = e.Date; date <= endDate; date = date.AddDays(e.RepeatValue * 7)) {
                        if (date >= startDate) {
                            var clone = e.Clone();
                            clone.Date = date;
                            yield return clone;
                        }
                    }
                    break;
                case EventRepeatEnum.Months:
                    for (var date = e.Date; date <= endDate; date = date.AddMonths(e.RepeatValue)) {
                        if (date >= startDate) {
                            var clone = e.Clone();
                            clone.Date = date;
                            yield return clone;
                        }
                    }
                    break;
                case EventRepeatEnum.Years:
                    for (var date = e.Date; date <= endDate; date = date.AddYears(e.RepeatValue)) {
                        if (date >= startDate) {
                            var clone = e.Clone();
                            clone.Date = date;
                            yield return clone;
                        }
                    }
                    break;
            }
        }
    }

    public async Task<EventDto> GetAsync(int id) {
        var model = await Rep.GetByIdAsync(id);
        return Mapper.Map<EventDto>(model);
    }

    public async Task<EventDto> CreateAsync(CreateEventDto dto, int userId) {
        var model = new Event();
        Mapper.Map(dto, model);
        await Rep.ExecuteCreateAsync(model, userId);
        return await this.GetAsync(model.Id);
    }

    public async Task<EventDto> UpdateAsync(UpdateEventDto dto, int userId) {
        var inModel = Mapper.Map<Event>(dto);
        await Rep.ExecuteUpdateAsync<IEventUpdateMap>(inModel, userId);
        return await this.GetAsync(dto.Id);
    }

    public async Task<int> DeletePermanentAsync(int id, int userId) {
        return await Rep.ExecuteDeleteAsync(id);
    }
}
