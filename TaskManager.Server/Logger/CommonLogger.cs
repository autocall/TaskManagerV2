using TaskManager.Common.Extensions;
using TaskManager.Common;

namespace TaskManager.Server.Logger;

public class CommonLogger : ICommonLogger {

    private ILogger _logger;

    public CommonLogger(ILogger<CommonLogger> logger) {
        this._logger = logger;
    }

    public void Log(LogLevel level, string message) {
        message = message.Truncate(4000);
        switch (level) {
            case LogLevel.Information:
                _logger.LogInformation(message);
                break;
            case LogLevel.Debug:
                _logger.LogDebug(message);
                break;
            case LogLevel.Warning:
                _logger.LogWarning(message);
                break;
            case LogLevel.Error:
                _logger.LogError(message);
                break;
            case LogLevel.Critical:
                _logger.LogCritical(message);
                break;
        }
        WriteLine(level, message);
    }

    public void Log(LogLevel level, string message, Exception ex) {
        message = message.Truncate(4000);
        switch (level) {
            case LogLevel.Information:
                _logger.LogInformation(ex, message);
                break;
            case LogLevel.Debug:
                _logger.LogDebug(ex, message);
                break;
            case LogLevel.Warning:
                _logger.LogWarning(ex, message);
                break;
            case LogLevel.Error:
                _logger.LogError(ex, message);
                break;
            case LogLevel.Critical:
                _logger.LogCritical(ex, message);
                break;
        }
        WriteLine(level, $"{message}\n{ex}".Truncate(4000));
    }

    private static object _lock = new object();

    /// <summary>
    ///     Write Line to Console </summary>
    public void WriteLine(LogLevel level, string message, ConsoleColor color = ConsoleColor.White) {
#if TEST || DEBUG
        lock (_lock) {
            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.Write($"{DateTime.Now:H:mm:ss} ");
            var lvl = String.Empty;
            switch (level) {
                case LogLevel.Information:
                    Console.ForegroundColor = ConsoleColor.DarkGreen;
                    lvl = "info";
                    break;
                case LogLevel.Debug:
                    Console.ForegroundColor = ConsoleColor.Blue;
                    lvl = "dbug";
                    break;
                case LogLevel.Warning:
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    lvl = "warn";
                    break;
                case LogLevel.Error:
                    Console.ForegroundColor = ConsoleColor.Red;
                    lvl = "erro";
                    break;
                case LogLevel.Critical:
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.BackgroundColor = ConsoleColor.Red;
                    lvl = "crit";
                    break;
            }
            Console.Write($"{lvl}: ");
            Console.ForegroundColor = color;
            Console.WriteLine(message);
        }
#endif
    }
}
