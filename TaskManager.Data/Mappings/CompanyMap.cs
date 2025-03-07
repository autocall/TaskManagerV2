using LinqToDB.Mapping;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Mappings;
public class CompanyMap : BaseMap<Company> {
    public override void Configure(EntityTypeBuilder<Company> builder) {
        builder.Ignore(e => e.CreatedBy);
        builder.ToTable(typeof(Company).Name);
    }
}
public class LinqToDbCompanyMap {
    public static void Configure(FluentMappingBuilder builder) {
        builder.Entity<Company>()
            .Ignore(e => e.CreatedBy)
            .Ignore(e => e.ModifiedBy);
    }
}