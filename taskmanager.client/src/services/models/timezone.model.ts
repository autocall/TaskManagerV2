export class TimeZoneModel {
    public Id: string;
    public DisplayName: string;
    public StandardName: string;
    public DaylightName: string;
    public BaseUtcOffset: any;
    public SupportsDaylightSavingTime: boolean;

    constructor(data: any) {
        this.Id = data.Id;
        this.DisplayName = data.DisplayName;
        this.StandardName = data.StandardName;
        this.DaylightName = data.DaylightName;
        this.BaseUtcOffset = data.BaseUtcOffset;
        this.SupportsDaylightSavingTime = data.SupportsDaylightSavingTime;
    }
}

export class ProfileTimeZoneModel {
    public TimeZones: TimeZoneModel[];
    public TimeZoneId: string;

    constructor(data: any) {
        this.TimeZones = (data.TimeZones as any[])?.map((e: any) => new TimeZoneModel(e)) ?? [];
        this.TimeZoneId = data.TimeZoneId;
    }
}
