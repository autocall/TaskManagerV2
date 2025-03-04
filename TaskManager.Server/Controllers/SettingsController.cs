using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using TaskManager.Common.Extensions;

namespace TaskManager.Server.Controllers;

public class SettingsController : Controller {
    [HttpGet, Route("/settings.js")]
    public IActionResult Index() {
        var frontendFields = typeof(Settings)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(field => field.GetCustomAttribute<FrontendAccessibleAttribute>() != null)
            .ToDictionary(field => field.Name, field => field.GetValue(null));

        var json = JsonExtension.Serialize(frontendFields);
        var script = $"window.settings = {json};";
        return Content(script, "application/javascript");
    }
}
