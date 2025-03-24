using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using TaskManager.Common.Extensions;

namespace TaskManager.Server.Models;

public class MultipartModel {
    [FromForm(Name = "modelJson")]
    public string ModelJson { get; set; }

    [FromForm(Name = "files")]
    public List<IFormFile> Files { get; set; }
}

public static class MultipartModelExtensions {
    public static T DeserializeModel<T>(this MultipartModel wrapper) {
        return JsonExtension.Deserialize<T>(wrapper.ModelJson);
    }

    public static List<ValidationResult> Validate<T>(this T model) {
        var context = new ValidationContext(model);
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(model, context, results, validateAllProperties: true);
        return results;
    }
}
