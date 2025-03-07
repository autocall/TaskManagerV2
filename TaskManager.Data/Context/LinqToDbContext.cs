using LinqToDB.Data;
using LinqToDB;
using LinqToDB.Mapping;
using TaskManager.Data.Mappings;

namespace TaskManager.Data.Context;

public class LinqToDbContext : DataConnection {
    public LinqToDbContext(TmDbContext dbContext)
        : base(CreateOptions(dbContext)) {
    }

    private static DataOptions CreateOptions(TmDbContext dbContext) {
        var mappingSchema = new MappingSchema();
        var builder = new FluentMappingBuilder(mappingSchema);
        LinqToDbCompanyMap.Configure(builder);
        builder.Build();

        var connection = Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.GetDbConnection(dbContext.Database);
        return new DataOptions().UseMappingSchema(mappingSchema).UseConnectionString(connection.ConnectionString).UseSqlServer();
    }
}

