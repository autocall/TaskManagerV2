using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Mappings;
public class CompanyMap : BaseMap<Company> {
    public override void Configure(EntityTypeBuilder<Company> builder) {
        //builder.Ignore(e => e.CreatedById);
        //builder.Ignore(e => e.ModifiedById);
        //builder.Ignore(e => e.CreatedBy);
        //builder.Ignore(e => e.ModifiedBy);
        builder.ToTable(typeof(Company).Name);
    }
}
