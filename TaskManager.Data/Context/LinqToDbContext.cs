using LinqToDB.Data;
using LinqToDB;
using LinqToDB.Mapping;
using TaskManager.Data.Mappings;

namespace TaskManager.Data.Context;

public class LinqToDbContext : DataConnection {
    public LinqToDbContext(DataOptions options) : base(options) {
        var mappingSchema = new MappingSchema();
        var builder = new FluentMappingBuilder(mappingSchema);
        CompanyMap.LinqToDbConfigure(builder);
        builder.Build();
        options.UseMappingSchema(mappingSchema);
    }
}

