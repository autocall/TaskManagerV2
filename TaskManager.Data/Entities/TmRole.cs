using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Data.Entities;
public class TmRole : IdentityRole<int> {
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public override int Id { get; set; }
}
