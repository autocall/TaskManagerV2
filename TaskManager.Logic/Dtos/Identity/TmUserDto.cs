namespace TaskManager.Logic.Dtos.Identity;
public class TmUserDto {
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public string TimeZoneId { get; set; }
    public string GitHubToken { get; set; }
    public DateTime CreatedDateTime { get; set; }
    public DateTime ModifiedDateTime { get; set; }
    public string Password { get; set; }
    public bool IsDeleted { get; set; }

    public List<TmRoleDto> Roles { get; set; }

}