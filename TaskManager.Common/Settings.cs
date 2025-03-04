namespace TaskManager;
[AttributeUsage(AttributeTargets.Field)]
public class FrontendAccessibleAttribute : Attribute { }

public partial interface Settings {
    public const string TestUserName = "test";
    public const string TestUserEmail = "test@tm.com";

    [FrontendAccessible]
    public const int CurrentCalendarWeeks = 6;
    [FrontendAccessible]
    public const int YearMonths = 12;
}