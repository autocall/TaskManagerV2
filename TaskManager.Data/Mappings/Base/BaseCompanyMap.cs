using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Mappings;
public abstract class BaseCompanyMap<T> : BaseMap<T> where T : BaseCompanyEntity {
    public override void Configure(EntityTypeBuilder<T> builder) {
        base.Configure(builder);
        builder.HasOne(e => e.Company).WithMany().HasForeignKey(e => e.CompanyId).OnDelete(DeleteBehavior.NoAction);
    }
}