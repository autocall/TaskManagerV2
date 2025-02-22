using System.Globalization;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class CalendarService : BaseService {

    private EventService EventService => this.Host.GetService<EventService>();

    public CalendarService(ServicesHost host) : base(host) { }

    public async Task<CalendarDto> GetCurrentAsync() {
        var days = new List<CalendarDayDto>();
        // TODO: use timezone
        var date = DateOnly.FromDateTime(DateTime.Now);
        var dto = new CalendarDto(date.Month, date.Year, days);
        var nowWeekOfYear = this.GetWeekOfYear(date);
        for (int i = 0; i < Settings.CurrentCalendarWeeks; i++) {
            var weekOfYear = this.GetWeekOfYear(date);
            // adds days
            days.AddRange(this.CreateWeek(weekOfYear, date.Year));
            // next week
            date = DateOnly.FromDateTime(CultureInfo.CurrentCulture.Calendar.AddWeeks(date.ToDateTime(default), 1));
        }

        // attaches events
        var events = await this.EventService.GetRangeAsync(days.Min(x => x.Date), days.Max(x => x.Date));
        foreach (var day in days) {
            day.Events = events.Where(x => x.Date == day.Date).ToList();
        }

        return dto;
    }

    #region [ Generator ]

    private int GetWeekOfYear(DateOnly date) {
        return CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(date.ToDateTime(default), CalendarWeekRule.FirstFullWeek, DayOfWeek.Monday);
    }

    private DateOnly GetFirstDayOfWeek(int weekOfYear, int year) {
        DateOnly jan1 = new DateOnly(year, 1, 1);
        int daysOffset = (int)DayOfWeek.Monday - (int)jan1.DayOfWeek;
        DateOnly firstMonday = jan1.AddDays(daysOffset < 0 ? daysOffset + 7 : daysOffset);
        DateOnly firstDayOfWeek = firstMonday.AddDays((weekOfYear - 1) * 7);
        return firstDayOfWeek;
    }

    private CalendarDayDto CreateFirstDayOfWeek(int weekOfYear, int year) {
        var date = this.GetFirstDayOfWeek(weekOfYear, year);
        return this.CreateDay(date);
    }

    private CalendarDayDto CreateNextDay(CalendarDayDto day) {
        var next = day.Date.AddDays(1);
        return CreateDay(next);
    }

    private CalendarDayDto CreateDay(DateOnly date) {
        return new CalendarDayDto(date) {
            // TODO: use timezone
            IsCurrentDay = date == DateOnly.FromDateTime(DateTime.Now)
        };
    }

    private IEnumerable<CalendarDayDto> CreateWeek(int weekOfYear, int year) {
        var day = this.CreateFirstDayOfWeek(weekOfYear, year);
        yield return day;
        for (int i = 0; i < 6; i++) {
            day = this.CreateNextDay(day);
            yield return day;
        }
    }

    #endregion [ Generator ]
}
