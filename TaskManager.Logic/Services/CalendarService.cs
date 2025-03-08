using System.Globalization;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class CalendarService : BaseService {
    private EventService EventService => this.Host.GetService<EventService>();
    private Calendar Calendar = CultureInfo.CurrentCulture.Calendar;

    public CalendarService(ServicesHost host) : base(host) { }

    public async Task<CalendarDto> GetCurrentAsync(DayOfWeek firstDayOfWeek, DateOnly now, int companyId) {
        var dto = this.Get(firstDayOfWeek, now, now);
        // attaches events
        var events = await this.EventService.GetRangeAsync(now, dto.Days.Min(x => x.Date), dto.Days.Max(x => x.Date), companyId);
        foreach (var day in dto.Days) {
            day.Events = events.Where(x => x.Date == day.Date).ToList();
        }
        return dto;
    }

    public CalendarDto Get(DayOfWeek firstDayOfWeek, DateOnly from, DateOnly now) {
        var days = new List<CalendarDayDto>();
        // TODO: use timezone
        var date = from;
        var dto = new CalendarDto(date.Month, date.Year, days);
        var nowWeekOfYear = this.GetWeekOfYear(date, firstDayOfWeek);
        for (int i = 0; i < Settings.CurrentCalendarWeeks; i++) {
            var weekOfYear = this.GetWeekOfYear(date, firstDayOfWeek);
            // adds days
            days.AddRange(this.CreateWeek(weekOfYear, date.Year, firstDayOfWeek, now));
            // next week
            date = DateOnly.FromDateTime(this.Calendar.AddWeeks(date.ToDateTime(default), 1));
        }
        return dto;
    }

    public async Task<List<CalendarDto>> GetYearAsync(DayOfWeek firstDayOfWeek, DateOnly now, int userId, int companyId) {
        var dtos = new List<CalendarDto>();
        for (int i = 0; i < Settings.YearMonths; i++) {
            var date = new DateOnly(now.Year, now.Month, 1).AddMonths(i);
            var dto = this.Get(firstDayOfWeek, date, now);
            dtos.Add(dto);
        }

        // attaches events
        var events = await this.EventService.GetRangeAsync(now,
            dtos.SelectMany(e => e.Days).Min(x => x.Date), dtos.SelectMany(e => e.Days).Max(x => x.Date), companyId);
        foreach (var dto in dtos) {
            foreach (var day in dto.Days) {
                day.Events = events.Where(x => x.Date == day.Date).ToList();
            }
        }

        return dtos;
    }

    #region [ Generator ]

    private int GetWeekOfYear(DateOnly date, DayOfWeek firstDayOfWeek) {
        return this.Calendar.GetWeekOfYear(date.ToDateTime(default), CalendarWeekRule.FirstDay, firstDayOfWeek);
    }

    private DateOnly GetFirstDateOfWeek(int weekOfYear, int year, DayOfWeek firstDayOfWeek) {
        DateOnly jan1 = new DateOnly(year, 1, 1);
        int jan1DayOfWeek = (int)jan1.DayOfWeek; // Get the day of the week for January 1st
        int offset = (jan1DayOfWeek - (int)firstDayOfWeek + 7) % 7; // Calculate the offset to the first desired weekday

        DateOnly firstWeekStart = jan1.AddDays(-offset); // Find the first occurrence of the specified weekday
        return firstWeekStart.AddDays((weekOfYear - 1) * 7); // Return the first date of the given week number
    }

    private CalendarDayDto CreateFirstDateOfWeek(int weekOfYear, int year, DayOfWeek firstDayOfWeek, DateOnly now) {
        var date = this.GetFirstDateOfWeek(weekOfYear, year, firstDayOfWeek);
        return this.CreateDate(date, now);
    }

    private CalendarDayDto CreateNextDate(CalendarDayDto day, DateOnly now) {
        var next = day.Date.AddDays(1);
        return CreateDate(next, now);
    }

    private CalendarDayDto CreateDate(DateOnly date, DateOnly now) {
        return new CalendarDayDto(date) {
            // TODO: use timezone
            IsCurrentDay = date == now
        };
    }

    private IEnumerable<CalendarDayDto> CreateWeek(int weekOfYear, int year, DayOfWeek firstDayOfWeek, DateOnly now) {
        var day = this.CreateFirstDateOfWeek(weekOfYear, year, firstDayOfWeek, now);
        yield return day;
        for (int i = 0; i < 6; i++) {
            day = this.CreateNextDate(day, now);
            yield return day;
        }
    }

    #endregion [ Generator ]
}
