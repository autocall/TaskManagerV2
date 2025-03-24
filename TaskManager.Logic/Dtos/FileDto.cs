namespace TaskManager.Logic.Dtos;

public class FileDto {
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public DateTime CreatedDateTime { get; set; }
    public DateTime ModifiedDateTime { get; set; }
    public string FileName { get; set; }
    public long Size { get; set; }
    public Stream Stream { get; set; }
    public bool IsDeleted { get; set; }
}
