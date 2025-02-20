namespace TaskManager.Logic.Dtos;

public class CalendarDayDto {
    public DateOnly Date { get; set; }
    public int DayOfWeek { get; set; }
    public int Day { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public bool IsCurrentDay { get; set; }
}
