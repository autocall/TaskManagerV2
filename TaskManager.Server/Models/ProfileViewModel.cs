using System.ComponentModel.DataAnnotations;

namespace TaskManager.Server.Models;

public class UpdateTimeZoneViewModel {
    [Required]
    public string TimeZoneId { get; set; }
}