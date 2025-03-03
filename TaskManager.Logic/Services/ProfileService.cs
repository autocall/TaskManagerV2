using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class ProfileService : BaseService {
    public ProfileService(ServicesHost host) : base(host) { }

    public List<TimeZoneDto> GetTimeZones() {
        var timeZoneDtos = new List<TimeZoneDto>();
        foreach (var item in TimeZoneInfo.GetSystemTimeZones()) {
            timeZoneDtos.Add(new TimeZoneDto(item));
        }
        return timeZoneDtos;
    }

    public async Task SetTimeZoneAsync(int userId, string timeZoneId) {
        var user = await this.Host.UserManager.FindByIdAsync(userId.ToString());
        if (user == null) {
            throw new Exception("User not found");
        }
        user.TimeZoneId = timeZoneId;
        await this.Host.UserManager.UpdateAsync(user);
    }

    public async Task<string> GetTimeZoneIdAsync(int userId) {
        var user = await this.Host.UserManager.FindByIdAsync(userId.ToString());
        if (user == null) {
            throw new Exception("User not found");
        }
        return user.TimeZoneId;
    }

    public async Task<TimeZoneDto> GetTimeZoneAsync(int userId) {
        var timeZoneId = await GetTimeZoneIdAsync(userId);
        if (timeZoneId == null) {
            timeZoneId = TimeZoneInfo.Utc.Id;
        }
        return this.GetTimeZoneById(timeZoneId);
    }

    public TimeZoneDto GetTimeZoneById(string timeZoneId) {
        if (timeZoneId == null) {
            timeZoneId = TimeZoneInfo.Utc.Id;
        }
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
        if (timeZone == null) {
            timeZone = TimeZoneInfo.Utc;
        }
        return new TimeZoneDto(timeZone);
    }
}