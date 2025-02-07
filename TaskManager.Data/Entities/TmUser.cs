using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Data.Entities;
public class TmUser : IdentityUser<int> {
    [Column(TypeName = "varchar(64)")]
    public string TimeZoneId { get; set; }

    [Required]
    [Column(TypeName = "smalldatetime")]
    public DateTime CreatedDateTime { get; set; }
    [Required]
    [Column(TypeName = "smalldatetime")]
    public DateTime ModifiedDateTime { get; set; }

    public int? CreatedId { get; set; }
    public int? ModifiedId { get; set; }

    public bool IsDeleted { get; set; }

    public static int SystemUserId = 1000;
    public static int AdminUserId = 11223344;

    [NotMapped]
    public static TmUser SystemUser => new TmUser {
        Id = SystemUserId,
        CreatedId = SystemUserId,
        ModifiedId = SystemUserId,
        Email = "system@tm.com",
        UserName = "System",
        CreatedDateTime = DateTime.UtcNow,
        ModifiedDateTime = DateTime.UtcNow,
    };
    [NotMapped]
    public static TmUser AdminUser => new TmUser {
        Id = AdminUserId,
        CreatedId = SystemUserId,
        ModifiedId = SystemUserId,
        Email = "admin@tm.com",
        UserName = "Admin",
        CreatedDateTime = DateTime.UtcNow,
        ModifiedDateTime = DateTime.UtcNow,
    };
}