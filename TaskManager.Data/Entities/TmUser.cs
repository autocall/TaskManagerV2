using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Data.Entities;
public class TmUser : IdentityUser<int> {
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public override int Id { get; set; }
    public int CompanyId { get; set; }

    /// <summary>
    ///     IANA time zone name </summary>
    [Column(TypeName = "varchar(64)")]
    public string TimeZoneId { get; set; }

    /// <summary>
    ///     GitHub access tokens </summary>
    [Column(TypeName = "varchar(200)")]
    public string GitHubToken { get; set; }

    [Required]
    [Column(TypeName = "smalldatetime")]
    public DateTime CreatedDateTime { get; set; }
    [Required]
    [Column(TypeName = "smalldatetime")]
    public DateTime ModifiedDateTime { get; set; }

    public int? CreatedId { get; set; }
    public int? ModifiedId { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("CompanyId")]
    public virtual Company Company { get; set; }

    public static int SystemUserId = 1000;
    public static int AdminUserId = 11223344;

    [NotMapped]
    public static TmUser SystemUser => new TmUser {
        Id = SystemUserId,
        CompanyId = Company.SystemCompanyId,
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
        CompanyId = Company.SystemCompanyId,
        CreatedId = SystemUserId,
        ModifiedId = SystemUserId,
        Email = "admin@tm.com",
        UserName = "Admin",
        CreatedDateTime = DateTime.UtcNow,
        ModifiedDateTime = DateTime.UtcNow,
    };
}