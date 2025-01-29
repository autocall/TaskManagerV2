using System.ComponentModel;
using System.Reflection;

namespace TaskManager.Common.Extensions;
public static class EnumExtension {
    /// <summary>
    ///     Gets description from attribute </summary>
    /// <param name="element">Enum element</param>
    /// <returns>Description text</returns>
    public static string GetDescription(this Enum element) {
        if (element == null) return null;
        Type type = element.GetType();

        MemberInfo[] memberInfo = type.GetMember(element.ToString());
        if (memberInfo.Length > 0) {
            object[] attributes = memberInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);
            if (attributes.Length > 0) {
                return ((DescriptionAttribute)attributes[0]).Description;
            }
        }
        return null;
    }
}