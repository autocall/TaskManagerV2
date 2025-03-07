using Microsoft.EntityFrameworkCore;
using TaskManager.Common;
using TaskManager.Data;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Enums;

namespace TaskManager.Logic.Services;
public class EventService : BaseService {
    private ICompanyRepository<Event> CompanyRep => UnitOfWork.GetCompanyRepository<Event>();
    private IRepository<Event> Rep(int companyId) => this.CompanyRep.Get(companyId);

    public EventService(ServicesHost host) : base(host) { }

    public async Task<List<EventDto>> GetAllAsync(int companyId) {
        var models = await Rep(companyId).GetAll(false).ToListAsync();
        return Mapper.Map<List<EventDto>>(models);
    }

    public async Task<List<EventDto>> GetRangeAsync(DateOnly now, DateOnly startDate, DateOnly endDate, int companyId) {
        var models = await Rep(companyId).GetAll(false).ToListAsync();
        var dtos = Mapper.Map<List<EventDto>>(models);
        return this.GenerateRange(dtos, now, startDate, endDate, companyId).ToList();
    }

    private IEnumerable<EventDto> GenerateRange(List<EventDto> events, DateOnly now, DateOnly startDate, DateOnly endDate, int companyId) {
        foreach (var e in events) {
            if (e.RepeatType != EventRepeatEnum.Default && e.RepeatValue <= 0) {
                // returns with an error
                var error = "Repeat value should be greater than 0";
                e.Clone();
                e.Description = error;
                _l.e(error);
                yield return e;
                continue;
            }
            if (e.Type == EventTypeEnum.Task && e.Date <= now) {
                // to need to complete the task
                yield return e.Clone(now);
            }
            if (e.RepeatType == EventRepeatEnum.Default) {
                // for e.Date in the range
                if (e.Date >= startDate && e.Date <= endDate) {
                    yield return e;
                }
            } else {
                // for e.Date -> endDate
                for (var date = e.Date; date <= endDate; date = GetNextDate(date, e.RepeatType, e.RepeatValue)) {
                    // checks the range
                    if (date >= startDate) {
                        // does not return a past task
                        if (e.Type != EventTypeEnum.Task || date >= now) {
                            yield return e.Clone(date);
                        }
                    }
                }
            }
        }
    }

    private DateOnly GetNextDate(DateOnly date, EventRepeatEnum repeatType, int repeatValue) {
        return repeatType switch {
            EventRepeatEnum.Days => date.AddDays(repeatValue),
            EventRepeatEnum.Weeks => date.AddDays(repeatValue * 7),
            EventRepeatEnum.Months => date.AddMonths(repeatValue),
            EventRepeatEnum.Years => date.AddYears(repeatValue),
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public async Task<EventDto> GetAsync(int id, int companyId) {
        var model = await Rep(companyId).GetByIdAsync(id);
        return Mapper.Map<EventDto>(model);
    }

    public async Task<EventDto> CreateAsync(CreateEventDto dto, int userId, int companyId) {
        var model = new Event();
        Mapper.Map(dto, model);
        await Rep(companyId).InsertAsync(model, userId);
        return await this.GetAsync(model.Id, companyId);
    }

    public async Task<EventDto> UpdateAsync(UpdateEventDto dto, int userId, int companyId) {
        var inModel = Mapper.Map<Event>(dto);
        await Rep(companyId).UpdateAsync<IEventUpdateMap>(inModel, userId);
        return await this.GetAsync(dto.Id, companyId);
    }

    public async Task<EventDto> CompleteAsync(int id, int userId, int companyId) {
        var model = await Rep(companyId).GetByIdAsync(id);
        if (model == null) {
            return null;
        }
        if (model.RepeatType == (int)EventRepeatEnum.Default) {
            await this.DeletePermanentAsync(id, userId, companyId);
            return null;
        } else {
            model.Date = GetNextDate(model.Date, (EventRepeatEnum)model.RepeatType, model.RepeatValue);
            await Rep(companyId).UpdateAsync<IEventUpdateDateMap>(model, userId);
            return await this.GetAsync(id, companyId);
        }
    }

    public async Task<int> DeletePermanentAsync(int id, int userId, int companyId) {
        return await Rep(companyId).DeleteAsync(id);
    }
}
