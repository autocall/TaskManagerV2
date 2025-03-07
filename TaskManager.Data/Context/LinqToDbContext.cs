using LinqToDB.Data;
using LinqToDB;
using LinqToDB.Mapping;
using TaskManager.Data.Mappings;
using Microsoft.Extensions.Configuration;

namespace TaskManager.Data.Context;

public class LinqToDbContext : DataConnection {
    public LinqToDbContext(TmDbContext dbContext)
        : base(CreateOptions(dbContext)) {
    }

    private static DataOptions CreateOptions(TmDbContext dbContext) {
        var mappingSchema = new MappingSchema();
        var builder = new FluentMappingBuilder(mappingSchema);
        CompanyMap.LinqToDbConfigure(builder);
        builder.Build();

        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
#if DEBUG
            .AddJsonFile("appsettings.Development.json")
#else
            .AddJsonFile("appsettings.json")
#endif
            .Build();
        configuration.GetConnectionString("DefaultConnection");
        return new DataOptions().UseMappingSchema(mappingSchema)
            .UseConnectionString(configuration.GetConnectionString("DefaultConnection")).UseSqlServer();
    }
}

