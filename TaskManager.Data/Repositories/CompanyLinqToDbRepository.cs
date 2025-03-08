using TaskManager.Data.Context;
using TaskManager.Data.Entities;

namespace TaskManager.Data.Repositories;
public class CompanyLinqToDbRepository<T> : LinqToDbRepository<T> where T : BaseCompanyEntity {

    protected int CompanyId;

    protected override IQueryable<T> Table() {
        return base.Table().Where(e => e.CompanyId == this.CompanyId);
    }

    public CompanyLinqToDbRepository(LinqToDbContext dbContext, int companyId) : base(dbContext) {
        this.CompanyId = companyId;
    }

    public override async Task InsertAsync(T model, int userId) {
        model.CompanyId = this.CompanyId;
        await base.InsertAsync(model, userId);
    }

    public override async Task InsertAsync(IEnumerable<T> models, int userId) {
        foreach (var model in models) {
            model.CompanyId = this.CompanyId;
        }
        await InsertAsync(models, userId);
    }
}
