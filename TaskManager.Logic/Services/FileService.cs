using System.Collections.Concurrent;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public interface IFileService : IService {
    Task<List<FileDto>> GetByIdsAsync(int companyId, List<int> objectIds);
    Task<List<FileDto>> GetAsync(int companyId, int objectId);
    Task<Stream> ReadAsync(int companyId, int id, string fileName);
    Task CreateAsync(FileDto dto);
    Task DeleteAsync(int companyId, int objectId, string fileName);
    Task DeleteAsync(int companyId, int objectId);
}

public class CachedFileService : FileService {
    /// <summary>
    ///     CompanyId -> ObjectId -> Files </summary>
    private static readonly ConcurrentDictionary<int, ConcurrentDictionary<int, List<FileDto>>> _cache = new();

    public CachedFileService(ServicesHost host) : base(host) { }

    public override async Task<List<FileDto>> GetAsync(int companyId, int objectId) {
        if (_cache.TryGetValue(companyId, out var companyFiles)) {
            if (companyFiles.TryGetValue(objectId, out var cachedFiles)) {
                return cachedFiles;
            }
        }
        var files = await base.GetAsync(companyId, objectId);
        var companyObjects = _cache.GetOrAdd(companyId, new ConcurrentDictionary<int, List<FileDto>>());
        companyObjects[objectId] = files;
        return files;
    }

    public override async Task CreateAsync(FileDto dto) {
        await base.CreateAsync(dto);
        if (_cache.TryGetValue(dto.CompanyId, out var companyFiles)) {
            companyFiles.Remove(dto.Id, out _);
        }
    }

    public override async Task DeleteAsync(int companyId, int objectId, string fileName) {
        await base.DeleteAsync(companyId, objectId, fileName);
        if (_cache.TryGetValue(companyId, out var companyFiles)) {
            companyFiles.Remove(objectId, out _);
        }
    }

    public override async Task DeleteAsync(int companyId, int objectId) {
        await base.DeleteAsync(companyId, objectId);
        if (_cache.TryGetValue(companyId, out var companyFiles)) {
            companyFiles.Remove(objectId, out _);
        }
    }
}

public abstract class FileService : BaseService, IFileService {
    public FileService(ServicesHost host) : base(host) { }

    public async Task<List<FileDto>> GetByIdsAsync(int companyId, List<int> objectIds) {
        var files = new List<FileDto>();
        foreach (var objectId in objectIds) {
            files.AddRange(await this.GetAsync(companyId, objectId));
        }
        return files;
    }

    /// <summary>
    ///     Gets files without file data </summary>
    public virtual Task<List<FileDto>> GetAsync(int companyId, int objectId) {
        var fullPath = Path.Combine(Settings.FilePath, companyId.ToString(), objectId.ToString());
        var files = new List<FileDto>();
        if (Directory.Exists(fullPath)) {
            var dir = new DirectoryInfo(fullPath);
            foreach (var file in dir.GetFiles()) {
                files.Add(new FileDto {
                    Id = objectId,
                    CompanyId = companyId,
                    FileName = file.Name,
                    Size = file.Length,
                    CreatedDateTime = file.CreationTime,
                    ModifiedDateTime = file.LastWriteTime,
                });
            }
        }
        return Task.FromResult(files);
    }

    public Task<Stream> ReadAsync(int companyId, int id, string fileName) {
        var fullPath = Path.Combine(Settings.FilePath, companyId.ToString(), id.ToString(), fileName);
        if (File.Exists(fullPath)) {
            return Task.FromResult(File.OpenRead(fullPath) as Stream);
        }
        return Task.FromResult<Stream>(null);
    }

    public virtual async Task CreateAsync(FileDto dto) {
        var fullPath = Path.Combine(Settings.FilePath, dto.CompanyId.ToString());
        if (!Directory.Exists(fullPath)) {
            Directory.CreateDirectory(fullPath);
        }
        fullPath = Path.Combine(fullPath, dto.Id.ToString());
        if (!Directory.Exists(fullPath)) {
            Directory.CreateDirectory(fullPath);
        }
        var uniqueFilePath = GetUniqueFilePath(fullPath, dto.FileName);
        var stream = dto.Stream;
        if (stream != null) {
            await using var fileStream = File.Create(uniqueFilePath);
            await stream.CopyToAsync(fileStream);
        }
    }

    private string GetUniqueFilePath(string directory, string fileName) {
        var nameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
        var extension = Path.GetExtension(fileName);
        var fullPath = Path.Combine(directory, fileName);
        int counter = 1;

        while (File.Exists(fullPath)) {
            var newFileName = $"{nameWithoutExtension} ({counter}){extension}";
            fullPath = Path.Combine(directory, newFileName);
            counter++;
        }

        return fullPath;
    }

    public virtual Task DeleteAsync(int companyId, int objectId, string fileName) {
        var fullPath = Path.Combine(Settings.FilePath, companyId.ToString(), objectId.ToString(), fileName);
        if (File.Exists(fullPath)) {
            File.Delete(fullPath);
        }
        return Task.CompletedTask;
    }

    public virtual Task DeleteAsync(int companyId, int objectId) {
        var fullPath = Path.Combine(Settings.FilePath, companyId.ToString(), objectId.ToString());
        if (Directory.Exists(fullPath)) {
            Directory.Delete(fullPath, true);
        }
        return Task.CompletedTask;
    }
}
