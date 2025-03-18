using TaskManager.Logic.Dtos;
using TimeZoneConverter;

namespace TaskManager.Logic.Helpers;
/// <summary>
///     "TimeZoneInfo" is only used here! </summary>
public static class TimeZoneHelper {
    public static string UtcId => TimeZoneInfo.Utc.Id;
    public static TimeZoneDto Utc => CreateDto(TimeZoneInfo.Utc);

    public static TimeZoneDto CreateDto(TimeZoneInfo tz) {
        return new TimeZoneDto(
            ToIanaId(tz.Id),
            tz.DisplayName,
            tz.StandardName,
            tz.DaylightName,
            tz.BaseUtcOffset,
            tz.SupportsDaylightSavingTime
        );
    }

    public static TimeZoneDto FindTimeZoneById(string timeZoneId) {
        return CreateDto(TimeZoneInfo.FindSystemTimeZoneById(FromIanaId(timeZoneId)));
    }

    public static List<TimeZoneDto> GetTimeZones() {
        return TimeZoneInfo.GetSystemTimeZones().Select(CreateDto).ToList();
    }

    public static DateTime ConvertTime(DateTime dateTime, string timeZoneId) {
        var tz = TimeZoneInfo.FindSystemTimeZoneById(FromIanaId(timeZoneId));
        return TimeZoneInfo.ConvertTime(dateTime, tz);
    }

    private static string ToIanaId(string timeZoneId) {
        if (OperatingSystem.IsWindows()) {
            return TZConvert.WindowsToIana(timeZoneId);
        }
        return timeZoneId;
    }

    private static string FromIanaId(string timeZoneId) {
        if (OperatingSystem.IsWindows()) {
            return TZConvert.IanaToWindows(timeZoneId);
        }
        return timeZoneId;
    }
}
