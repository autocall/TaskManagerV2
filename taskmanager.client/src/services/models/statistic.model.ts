export default class StatisticModel {
    TodayHours: number;
    WeekHours: number;

    constructor(data: any) {
        this.TodayHours = data.TodayHours;
        this.WeekHours = data.WeekHours;
    }
}
