using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Data.Entities;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class EventService : BaseService {
    private Repository<Event> Rep => UnitOfWork.GetRepository<Event>();

    public EventService(ServicesHost host) : base(host) { }

    public async Task<List<EventDto>> GetAllAsync() {
        var models = await Rep.GetAll(false).ToListAsync();
        return Mapper.Map<List<EventDto>>(models);
    }

    public async Task<List<EventDto>> GetRangeAsync(DateOnly startDate, DateOnly endDate) {
        var models = await Rep.GetAll(false).Where(x => x.Date >= startDate && x.Date <= endDate).ToListAsync();
        return Mapper.Map<List<EventDto>>(models);
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
