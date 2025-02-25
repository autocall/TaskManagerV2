using TaskManager.Common;
using TaskManager.Logic;

namespace TaskManager.Server.BackgroundServices;
public abstract class BaseBackgroundService : BackgroundService {
    public IServiceProvider ServiceProvider { get; }

    protected abstract TimeSpan Interval { get; }

    public BaseBackgroundService(IServiceProvider serviceProvider) {
        ServiceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
        while (!stoppingToken.IsCancellationRequested) {
            using IServiceScope scope = ServiceProvider.CreateScope();
            var host = scope.ServiceProvider.GetRequiredService<ServicesHost>();
            try {
                await ExecuteIterationAsync(host, stoppingToken);
            } catch (TaskCanceledException) {
                return;
            } catch (Exception e) {
                _l.e("Execute", e);
            } finally {
                await Task.Delay(Interval, stoppingToken);
            }
        }
    }

    protected abstract Task ExecuteIterationAsync(ServicesHost host, CancellationToken stoppingToken);

    public override async Task StopAsync(CancellationToken stoppingToken) {
        _l.i($"Stop");
        await base.StopAsync(stoppingToken);
    }
}