using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TaskManager.Data;
using TaskManager.Data.Entities;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class CategoryService : BaseService {
    private Repository<Category> Rep => UnitOfWork.GetRepository<Category>();

    public CategoryService(ServicesHost host) : base(host) { }

    public async Task<List<CategoryDto>> GetAllAsync() {
        var models = await Rep.GetAll(false).OrderByDescending(x => x.Order).ToListAsync();
        return Mapper.Map<List<CategoryDto>>(models);
    }

    public async Task<CategoryDto> GetAsync(int id) {
        var model = await Rep.GetByIdAsync(id);
        return Mapper.Map<CategoryDto>(model);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, int userId) {
        var model = new Category();
        Mapper.Map(dto, model);
        var order = await GetMaxOrderAsync(userId) + 1;
        if (order > Byte.MaxValue) {
            throw new Exception("Max order reached");
        } else {
            model.Order = (byte)order;
        }
        model.Order = (byte)order;
        await Rep.ExecuteCreateAsync(model, userId);
        return await this.GetAsync(model.Id);
    }

    public async Task<CategoryDto> UpdateAsync(UpdateCategoryDto dto, int userId) {
        var inModel = Mapper.Map<Category>(dto);
        await Rep.ExecuteUpdateAsync<ICategoryUpdateMap>(inModel, userId);
        return await this.GetAsync(dto.Id);
    }

    public async Task<CategoryDto> UpdateOrderAsync(UpdateCategoryOrderDto dto, int userId) {
        var oldModel = await Rep.GetByIdAsync(dto.Id);
        var swapModel = dto.Order switch {
            1 => await GetNextAsync(oldModel.Order, userId),
            -1 => await GetPreviousAsync(oldModel.Order, userId),
            _ => throw new Exception($"Invalid order: {dto.Order}")
        };
        if (swapModel != null) {
            Console.WriteLine($"Swap: {oldModel.Id} - {swapModel.Id}");
            var swapOrder = swapModel.Order;
            swapModel.Order = oldModel.Order;
            oldModel.Order = swapOrder;
            await Rep.ExecuteUpdateAsync<ICategoryOrderUpdateMap>(swapModel, userId);
            await Rep.ExecuteUpdateAsync<ICategoryOrderUpdateMap>(oldModel, userId);
        }
        return await this.GetAsync(dto.Id);
    }

    public async Task<int> DeleteAsync(int id, int userId) {
        return await Rep.ExecuteUpdateIsDeletedAsync(id, true, userId);
    }

    public async Task<int> DeletePermanentAsync(int id, int userId) {
        return await Rep.ExecuteDeleteAsync(id);
    }

    #region [ private ]

    private async Task<int> GetMaxOrderAsync(int userId) {
        return await Rep.GetAll(false).Where(e => e.CreatedById == userId).MaxAsync(e => e.Order);
    }

    private async Task<Category> GetNextAsync(int order, int userId) {
        return await Rep.GetAll(false)
            .Where(e => e.Order > order && e.CreatedById == userId).OrderBy(e => e.Order).FirstOrDefaultAsync();
    }

    private async Task<Category> GetPreviousAsync(int order, int userId) {
        return await Rep.GetAll(false)
            .Where(e => e.Order < order && e.CreatedById == userId).OrderByDescending(e => e.Order).FirstOrDefaultAsync();
    }


    #endregion [ private ]
}
