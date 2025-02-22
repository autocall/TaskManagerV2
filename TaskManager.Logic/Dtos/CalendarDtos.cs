namespace TaskManager.Logic.Dtos;

public class CalendarDayDto {
    public DateOnly Date { get; }
    public int DayOfWeek { get; }
    public int Day { get; }
    public int Month { get; }
    public int Year { get; }
    public bool IsCurrentDay { get; set; }

    public List<EventDto> Events { get; set; }

    public CalendarDayDto(DateOnly date) {
        Date = date;
        DayOfWeek = (int)date.DayOfWeek;
        Day = date.Day;
        Month = date.Month;
        Year = date.Year;
    }
}

public class CalendarDto {
    public int Month { get; }
    public int Year { get; }

    public List<CalendarDayDto> Days { get; }

    public CalendarDto(int month, int year, List<CalendarDayDto> days) {
        Month = month;
        Year = year;
        Days = days;
    }
}
