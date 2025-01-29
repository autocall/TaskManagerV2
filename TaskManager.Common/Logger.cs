using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using TaskManager.Common.Exceptions;
using TaskManager.Common.Extensions;

namespace TaskManager.Common;
public interface ICommonLogger {
    void Log(LogLevel level, string message);
    void Log(LogLevel level, string message, Exception ex);
    void WriteLine(LogLevel level, string message, ConsoleColor color);
}

public static class _l {

    #region [ .ctor ]

    private static ICommonLogger _instance;
    public static void Init(ICommonLogger instance) {
        _instance = instance;
    }

    #endregion [ .ctor ]

    #region [ Public ]

    public static void i(string message) {
        _instance?.Log(LogLevel.Information, message);
    }

    public static void w(string message) {
        _instance?.Log(LogLevel.Warning, message);
    }
    public static void w(string message, Exception ex) {
        if (ex is InfoException == false) {
            _instance?.Log(LogLevel.Warning, message, ex);
        }
    }

    public static void e(string message) {
        _instance?.Log(LogLevel.Error, message);
    }
    public static void e(object obj) {
        _instance?.Log(LogLevel.Error, JsonExtension.Serialize(obj, TypeNameHandling.Auto, NullValueHandling.Include));
    }
    public static void e(string message, Exception ex) {
        if (ex is InfoException == false) {
            _instance?.Log(LogLevel.Error, message, ex);
        }
    }

    public static void f(string message) {
        _instance?.Log(LogLevel.Critical, message);
    }
    public static void f(string message, Exception ex) {
        if (ex is InfoException == false) {
            _instance?.Log(LogLevel.Critical, message, ex);
        }
    }

    public static void d(object obj) {
        _instance?.Log(LogLevel.Debug, JsonExtension.Serialize(obj, Newtonsoft.Json.TypeNameHandling.All));
    }
    public static void d(string message) {
        _instance?.Log(LogLevel.Debug, message);
    }
    public static void DebugWriteLine(string message, ConsoleColor color) {
        _instance?.WriteLine(LogLevel.Debug, message, color);
    }
    public static void d(string message, Exception ex) {
        if (ex is InfoException == false) {
            _instance?.Log(LogLevel.Debug, message, ex);
        }
    }

    public static IDisposable dt(string message) {
        return new LogItem((ts) => d($"{message} {StringExtension.ToString(ts)}"));
    }

    public static IDisposable it(string message) {
        return new LogItem((ts) => i($"{message} {StringExtension.ToString(ts)}"));
    }

    #endregion [ Public ]
}

public class LogItem : IDisposable {
    private Action<TimeSpan> _action;
    private DateTime _started = DateTime.UtcNow;

    public LogItem(Action<TimeSpan> action) {
        this._action = action;
    }

    public void Dispose() {
        this._action(DateTime.UtcNow - this._started);
    }
}