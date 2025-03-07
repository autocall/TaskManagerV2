using TaskManager.Data.Entities;

namespace TaskManager.Data.Repositories;
public interface ICompanyRepository { }
public class CompanyRepository<T> : ICompanyRepository<T>, ICompanyRepository where T : BaseCompanyEntity {
    private UnitOfWork UnitOfWork;

    public CompanyRepository(UnitOfWork unitOfWork) { 
        this.UnitOfWork = unitOfWork;
    }

    public IRepository<T> Get(int companyId) {
        return UnitOfWork.GetRepository<T>(companyId);
    }
}
