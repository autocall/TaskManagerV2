using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Mappings;
public class ProjectMap : BaseCompanyMap<Project> {
    public override void Configure(EntityTypeBuilder<Project> builder) {
        base.Configure(builder);
    }
}
