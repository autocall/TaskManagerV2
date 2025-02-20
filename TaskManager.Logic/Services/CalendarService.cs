using System.Globalization;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class CalendarService : BaseService {

    public CalendarService(ServicesHost host) : base(host) { }

    public async Task<List<CalendarDayDto>> GetCurrentAsync() {
        var days = new List<CalendarDayDto>();
        // TODO: use timezone
        var date = DateTime.Now;
        var nowWeekOfYear = this.GetWeekOfYear(date);
        for (int i = 0; i < Settings.CurrentCalendarWeeks; i++) {
            var weekOfYear = this.GetWeekOfYear(date);
            // adds days
            days.AddRange(this.CreateWeek(weekOfYear, date.Year));
            // next week
            date = CultureInfo.CurrentCulture.Calendar.AddWeeks(date, 1);
        }
        return days;
    }

    #region [ Generator ]

    private int GetWeekOfYear(DateTime date) {
        return CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(date, CalendarWeekRule.FirstFullWeek, DayOfWeek.Monday);
    }

    private DateOnly GetFirstDayOfWeek(int weekOfYear, int year) {
        DateTime jan1 = new DateTime(year, 1, 1);
        int daysOffset = (int)DayOfWeek.Monday - (int)jan1.DayOfWeek;
        DateTime firstMonday = jan1.AddDays(daysOffset < 0 ? daysOffset + 7 : daysOffset);
        DateTime firstDayOfWeek = firstMonday.AddDays((weekOfYear - 1) * 7);
        return DateOnly.FromDateTime(firstDayOfWeek);
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
        return new CalendarDayDto {
            Date = date,
            DayOfWeek = (int)date.DayOfWeek,
            Day = date.Day,
            Month = date.Month,
            Year = date.Year,
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
