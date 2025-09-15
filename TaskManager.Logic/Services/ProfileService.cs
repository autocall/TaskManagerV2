using TaskManager.Common;
using TaskManager.Common.Extensions;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Helpers;

namespace TaskManager.Logic.Services;
public class ProfileService : BaseService {
    public ProfileService(ServicesHost host) : base(host) { }

    public List<TimeZoneDto> GetTimeZones() {
        return TimeZoneHelper.GetTimeZones();
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

    public async Task SetGitHubTokenAsync(int userId, string gitHubToken) {
        var user = await this.Host.UserManager.FindByIdAsync(userId.ToString());
        if (user == null) {
            throw new Exception("User not found");
        }
        user.GitHubToken = String.IsNullOrWhiteSpace(gitHubToken) == false ? gitHubToken : null;
        await this.Host.UserManager.UpdateAsync(user);
    }

    public async Task<string> GetGitHubTokenAsync(int userId) {
        var user = await this.Host.UserManager.FindByIdAsync(userId.ToString());
        if (user == null) {
            throw new Exception("User not found");
        }
        return user.GitHubToken.TruncateToken();
    }

    /// <summary>
    ///     Gets the user TimeZone or UTC if not set </summary>
    public async Task<TimeZoneDto> GetTimeZoneAsync(int userId) {
        var timeZoneId = await GetTimeZoneIdAsync(userId);
        if (timeZoneId == null) {
            timeZoneId = TimeZoneHelper.UtcId;
        }
        return this.GetTimeZoneById(timeZoneId);
    }

    /// <summary>
    ///     Gets the user TimeZone or UTC if not set </summary>
    public TimeZoneDto GetTimeZoneById(string timeZoneId) {
        if (timeZoneId == null) {
            return TimeZoneHelper.Utc;
        }
        var timeZone = TimeZoneHelper.FindTimeZoneById(timeZoneId);
        if (timeZone == null) {
            return TimeZoneHelper.Utc;
        } else {
            return timeZone;
        }
    }

    /// <summary>
    ///     Gets current time of the user </summary>
    public async Task<DateTime> GetNowAsync(int userId) {
        var timeZone = await this.GetTimeZoneAsync(userId);
        return TimeZoneHelper.ConvertTime(DateTime.Now, timeZone.Id);
    }
}