namespace TaskManager.Common.Extensions;
public static class StringExtension {
    public static string Truncate(this string value, int maxLength) {
        if (string.IsNullOrEmpty(value)) return value;
        return value.Length <= maxLength ? value : value.Substring(0, maxLength);
    }
    public static string TruncateToken(this string value) {
        if (string.IsNullOrEmpty(value)) return value;
        var maxLength = 20;
        return value.Length <= maxLength ? value : value.Substring(0, maxLength) + "...";
    }
    public static string ToString(TimeSpan ts) {
        if (ts < TimeSpan.Zero) {
            return $"-{ToString(-ts)}";
        }
        if (ts < TimeSpan.FromSeconds(0.1)) {
            return $"0s";
        }
        if (ts < TimeSpan.FromSeconds(1)) {
            return $"{ts.TotalSeconds:F1}s";
        }
        if (ts < TimeSpan.FromMinutes(1)) {
            return $"{(int)ts.TotalSeconds}s";
        }
        if (ts < TimeSpan.FromHours(1)) {
            return $"{(int)ts.TotalMinutes}m";
        }
        if (ts.TotalHours < 2) {
            return $"{(int)ts.TotalHours}h.{ts.Minutes:D2}m";
        }
        if (ts.TotalHours < 24) {
            return $"{(int)ts.TotalHours}h";
        }
        if (ts.TotalDays < 10) {
            return $"{ts.TotalDays:F1}d";
        } else {
            return $"{(int)ts.TotalDays}d";
        }
    }
}
