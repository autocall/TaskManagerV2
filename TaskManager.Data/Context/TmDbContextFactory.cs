using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace TaskManager.Data.Context;
public class TmDbContextFactory : IDesignTimeDbContextFactory<TmDbContext> {
    public TmDbContext CreateDbContext(string[] args) {
        var optionsBuilder = new DbContextOptionsBuilder<TmDbContext>();
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
#if DEBUG
            .AddJsonFile("appsettings.Development.json")
#else
            .AddJsonFile("appsettings.json")
#endif
            .Build();

        optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        return new TmDbContext(optionsBuilder.Options);
    }
}
