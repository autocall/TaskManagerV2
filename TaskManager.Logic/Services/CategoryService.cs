using LinqToDB.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class CategoryService : BaseService {
    private ICompanyRepository<Category> CompanyRep => UnitOfWork.GetCompanyRepository<Category>();
    private IRepository<Category> Rep(int companyId) => this.CompanyRep.Get(companyId);

    public CategoryService(ServicesHost host) : base(host) { }

    public async Task<List<CategoryDto>> GetAllAsync(int companyId) {
        var models = await Rep(companyId).GetAll(false).OrderByDescending(x => x.Order).ToListAsync();
        return Mapper.Map<List<CategoryDto>>(models);
    }

    public async Task<CategoryDto> GetAsync(int id, int companyId) {
        var model = await Rep(companyId).GetByIdAsync(id);
        return Mapper.Map<CategoryDto>(model);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, int userId, int companyId) {
        var model = new Category();
        Mapper.Map(dto, model);
        var order = await GetMaxOrderAsync(userId, companyId) + 1;
        if (order > Byte.MaxValue) {
            throw new Exception("Max order reached");
        } else {
            model.Order = (byte)order;
        }
        model.Order = (byte)order;
        await Rep(companyId).InsertAsync(model, userId);
        return await this.GetAsync(model.Id, companyId);
    }

    public async Task<CategoryDto> UpdateAsync(UpdateCategoryDto dto, int userId, int companyId) {
        var inModel = Mapper.Map<Category>(dto);
        await Rep(companyId).UpdateAsync<ICategoryUpdateMap>(inModel, userId);
        return await this.GetAsync(dto.Id, companyId);
    }

    public async Task<CategoryDto> UpdateOrderAsync(UpdateCategoryOrderDto dto, int userId, int companyId) {
        var rep = Rep(companyId);
        var oldModel = await rep.GetByIdAsync(dto.Id);
        var swapModel = dto.Order switch {
            1 => await GetNextAsync(oldModel.Order, userId, companyId),
            -1 => await GetPreviousAsync(oldModel.Order, userId, companyId),
            _ => throw new Exception($"Invalid order: {dto.Order}")
        };
        if (swapModel != null) {
            var swapOrder = swapModel.Order;
            swapModel.Order = oldModel.Order;
            oldModel.Order = swapOrder;
            await rep.UpdateAsync<ICategoryOrderUpdateMap>(swapModel, userId);
            await rep.UpdateAsync<ICategoryOrderUpdateMap>(oldModel, userId);
        }
        return await this.GetAsync(dto.Id, companyId);
    }

    public async Task<int> DeleteAsync(int id, int userId, int companyId) {
        return await Rep(companyId).UpdateIsDeletedAsync(id, true, userId);
    }

    public async Task<int> DeletePermanentAsync(int id, int userId, int companyId) {
        return await Rep(companyId).DeleteAsync(id);
    }

    #region [ private ]

    private async Task<int> GetMaxOrderAsync(int userId, int companyId) {
        return await Rep(companyId).GetAll(false).Where(e => e.CreatedById == userId).MaxAsyncLinqToDB(e => e.Order);
    }

    private async Task<Category> GetNextAsync(int order, int userId, int companyId) {
        return await Rep(companyId).GetAll(false)
            .Where(e => e.Order > order && e.CreatedById == userId).OrderBy(e => e.Order).FirstOrDefaultAsyncLinqToDB();
    }

    private async Task<Category> GetPreviousAsync(int order, int userId, int companyId) {
        return await Rep(companyId).GetAll(false)
            .Where(e => e.Order < order && e.CreatedById == userId).OrderByDescending(e => e.Order).FirstOrDefaultAsyncLinqToDB();
    }

    #endregion [ private ]
}
