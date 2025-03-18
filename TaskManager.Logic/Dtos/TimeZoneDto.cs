namespace TaskManager.Logic.Dtos;
public class TimeZoneDto {
    public string Id { get; }
    public string DisplayName { get; }
    public string StandardName { get; }
    public string DaylightName { get; }
    public TimeSpan BaseUtcOffset { get; }
    public bool SupportsDaylightSavingTime { get; }

    public TimeZoneDto(
            string id,
            string displayName,
            string standardName,
            string daylightName,
            TimeSpan baseUtcOffset,
            bool supportsDaylightSavingTime) {
        Id = id;
        DisplayName = displayName;
        StandardName = standardName;
        DaylightName = daylightName;
        BaseUtcOffset = baseUtcOffset;
        SupportsDaylightSavingTime = supportsDaylightSavingTime;
    }
}
