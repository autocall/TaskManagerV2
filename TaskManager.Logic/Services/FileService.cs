using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class FileService : BaseService {
    public FileService(ServicesHost host) : base(host) { }

    public async Task<List<FileDto>> GetByIdsAsync(int companyId, List<int> ids) {
        return new List<FileDto>() {
            new FileDto() { Id = 1, FileName = "file1.png", Size = 100 },
            new FileDto() { Id = 2, FileName = "file2.pdf", Size = 200 },
            new FileDto() { Id = 3, FileName = "file3.txt", Size = 300 },
            new FileDto() { Id = 3, FileName = "file31.txt", Size = 300 },
            new FileDto() { Id = 3, FileName = "file32.txt", Size = 300 },
            new FileDto() { Id = 3, FileName = "file33.txt", Size = 300 },
            new FileDto() { Id = 3, FileName = "file34.txt", Size = 300 },
            new FileDto() { Id = 3, FileName = "file35.txt", Size = 300 },
            new FileDto() { Id = 3, FileName = "file36.txt", Size = 300 },
            new FileDto() { Id = 3, FileName = "file38.txt", Size = 300 },
            new FileDto() { Id = 3, FileName = "file37.txt", Size = 300 },
        };
    }

    //public async Task<TaskDto> GetAsync(int id, int companyId) {
    //    var model = await Rep(companyId).GetByIdAsync(id);
    //    return Mapper.Map<TaskDto>(model);
    //}

    //public async Task<TaskDto> CreateAsync(CreateTaskDto dto, int userId, int companyId) {
    //    var model = new Task();
    //    Mapper.Map(dto, model);
    //    await Rep(companyId).InsertAsync(model, userId);
    //    return await this.GetAsync(model.Id, companyId);
    //}

    //public async Task<TaskDto> UpdateAsync(UpdateTaskDto dto, int userId, int companyId) {
    //    var inModel = Mapper.Map<Task>(dto);
    //    await Rep(companyId).UpdateAsync<ITaskUpdateMap>(inModel, userId);
    //    return await this.GetAsync(dto.Id, companyId);
    //}

    //public async Task<int> DeleteAsync(int id, int userId, int companyId) {
    //    return await Rep(companyId).UpdateIsDeletedAsync(id, true, userId);
    //}

    //public async Task<int> DeletePermanentAsync(int id, int userId, int companyId) {
    //    return await Rep(companyId).DeleteAsync(id);
    //}
}
