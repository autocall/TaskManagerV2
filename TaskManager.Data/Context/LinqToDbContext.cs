using LinqToDB.Data;
using LinqToDB;

namespace TaskManager.Data.Context;

public class LinqToDbContext : DataConnection {
    public LinqToDbContext(TmDbContext dbContext)
        : base(CreateOptions(dbContext)) {
    }

    private static DataOptions CreateOptions(TmDbContext dbContext) {
        var connection = Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.GetDbConnection(dbContext.Database);
        //.UseMappingSchema(new MappingSchema())
        return new DataOptions().UseConnectionString(connection.ConnectionString).UseSqlServer();
    }
}
