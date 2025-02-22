using Microsoft.AspNetCore.Mvc;
using TaskManager.Common.Extensions;

namespace TaskManager.Server.Controllers;

public class SettingsController : Controller {
    [HttpGet, Route("/settings.js")]
    public IActionResult Index() {
        var settings = new {
            Settings.CurrentCalendarWeeks
        };

        var json = JsonExtension.Serialize(settings);
        var script = $"window.settings = {json};";
        return Content(script, "application/javascript");
    }
}
