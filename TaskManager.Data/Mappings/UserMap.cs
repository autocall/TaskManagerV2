using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Mappings;
public class UserMap : IEntityTypeConfiguration<TmUser> {


    public void Configure(EntityTypeBuilder<TmUser> builder) {
        builder.HasOne(e => e.Company).WithMany().HasForeignKey(e => e.CompanyId).OnDelete(DeleteBehavior.NoAction);
        builder.ToTable("IdentityUsers");
    }
}
