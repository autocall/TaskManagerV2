using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Mappings;
public class BaseMap<T> : IEntityTypeConfiguration<T> where T : BaseEntity {
    public virtual void Configure(EntityTypeBuilder<T> builder) {
        builder.HasOne(e => e.CreatedBy).WithMany().HasForeignKey(e => e.CreatedById).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(e => e.ModifiedBy).WithMany().HasForeignKey(e => e.ModifiedById).OnDelete(DeleteBehavior.NoAction);
        builder.ToTable(typeof(T).Name);
    }
}