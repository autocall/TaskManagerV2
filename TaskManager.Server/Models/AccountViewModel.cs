using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Server.Models;

public class LoginViewModel {
    [Required]
    [EmailAddress]
    [Display(Name = "Email")]
    [BindProperty(Name = "email")]
    public virtual string Email { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    [BindProperty(Name = "password")]
    public string Password { get; set; }

    public string ReturnUrl { get; set; } = "/";

    public string ThirdPartyId { get; set; }

    public string Version { get; set; }
}

public class SignUpViewModel {
    [Required]
    [Display(Name = "UserName")]
    [BindProperty(Name = "username")]
    public string UserName { get; set; }
    [Required]
    [EmailAddress]
    [Display(Name = "Email")]
    [BindProperty(Name = "email")]
    public string Email { get; set; }
    [Required]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "Password")]
    [BindProperty(Name = "password")]
    public string Password { get; set; }
}

public class ChangeDefaultPasswordViewModel {
    public Guid UserId { get; set; }
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "Password")]
    [BindProperty(Name = "password")]
    public string Password { get; set; }
}
