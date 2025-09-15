using System.ComponentModel.DataAnnotations;

namespace TaskManager.Server.Models;

public class UpdateTimeZoneViewModel {
    [Required]
    public string TimeZoneId { get; set; }
}
public class UpdateGitHubTokenViewModel {
    public string Owner { get; set; }
    public string Token { get; set; }
}