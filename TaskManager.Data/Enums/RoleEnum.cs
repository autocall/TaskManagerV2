using System.ComponentModel;

namespace TaskManager.Data.Enums;
public enum RoleEnum {
    [Description("User")]
    User = 1,
    [Description("Admin")]
    Admin = 2
}
