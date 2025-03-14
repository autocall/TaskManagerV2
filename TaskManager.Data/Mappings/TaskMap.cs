using LinqToDB.Mapping;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Mappings;
public class TaskMap : BaseCompanyMap<Task1> {
    override public void Configure(EntityTypeBuilder<Task1> builder) {
        builder.HasOne(e => e.Category).WithMany().HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(e => e.Project).WithMany().HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.NoAction);
        base.Configure(builder);
        builder.ToTable("Task");
    }

    public static void LinqToDbConfigure(FluentMappingBuilder builder) {
        builder.Entity<Task1>().HasTableName("Task");
    }
}
