using Microsoft.Extensions.DependencyInjection;

namespace TaskManager.Logic;
public static class ServiceLocator {
    private static IServiceProvider _serviceProvider;

    public static void Initialize(IServiceProvider serviceProvider) {
        _serviceProvider = serviceProvider;
    }

    public static ServicesHost GetHost() {
        if (_serviceProvider == null)
            throw new InvalidOperationException("ServiceProvider не инициализирован!");

        using var scope = _serviceProvider.CreateScope();
        return scope.ServiceProvider.GetRequiredService<ServicesHost>();
    }

    public static void Dispose() {
        if (_serviceProvider is IDisposable disposable) {
            disposable.Dispose();
        }
    }
}
