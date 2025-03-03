namespace TaskManager.Logic.Dtos;
public class TimeZoneDto {
    public string Id { get; private set; }
    public string DisplayName { get; private set; }
    public string StandardName { get; private set; }
    public string DaylightName { get; private set; }
    public TimeSpan BaseUtcOffset { get; private set; }
    public bool SupportsDaylightSavingTime { get; private set; }

    public TimeZoneDto(TimeZoneInfo tz) {
        Id = tz.Id;
        DisplayName = tz.DisplayName;
        StandardName = tz.StandardName;
        DaylightName = tz.DaylightName;
        BaseUtcOffset = tz.BaseUtcOffset;
        SupportsDaylightSavingTime = tz.SupportsDaylightSavingTime;
    }
}
