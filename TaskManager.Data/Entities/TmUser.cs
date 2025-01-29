using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Data.Entities;
public class TmUser : IdentityUser<Guid> {
    [Column(TypeName = "varchar(64)")]
    public string TimeZoneId { get; set; }

    [Required]
    [Column(TypeName = "smalldatetime")]
    public DateTime CreatedDateTime { get; set; }
    [Required]
    [Column(TypeName = "smalldatetime")]
    public DateTime ModifiedDateTime { get; set; }

    public Guid? CreatedId { get; set; }
    public Guid? ModifiedId { get; set; }

    public bool IsDeleted { get; set; }

    public static Guid SystemUserId = new Guid("1ABB568A-2ECD-43E6-B814-BE164CF2F6F4");
    public static Guid AdminUserId = new Guid("37F9538C-5955-4C7F-A9E3-86FFEF2333FC");

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