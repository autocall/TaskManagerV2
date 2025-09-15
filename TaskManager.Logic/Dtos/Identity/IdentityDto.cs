namespace TaskManager.Logic.Dtos.Identity;
public class IdentityDto {
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public TimeZoneDto TimeZone { get; set; }
    public string GitHubToken { get; set; }
    public IList<string> Roles { get; set; }
}