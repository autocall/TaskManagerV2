using Newtonsoft.Json;

namespace TaskManager.Common.Extensions;
public static class JsonExtension {
    public static string Serialize<T>(T obj, JsonConverter converter) {
        var settings = new JsonSerializerSettings();
        settings.Converters.Add(converter);
        var result = JsonConvert.SerializeObject(obj, settings);
        return result;
    }

    public static string Serialize<T>(T obj,
        TypeNameHandling typeNameHandling = TypeNameHandling.None,
        NullValueHandling nullValueHandling = NullValueHandling.Ignore) {
        var settings = new JsonSerializerSettings();
        settings.TypeNameHandling = typeNameHandling;
        settings.NullValueHandling = nullValueHandling;
        var result = JsonConvert.SerializeObject(obj, settings);
        return result;
    }

    public static T Deserialize<T>(string str, JsonConverter converter) {
        var settings = new JsonSerializerSettings();
        settings.Converters.Add(converter);
        settings.TypeNameHandling = TypeNameHandling.Auto;
        settings.NullValueHandling = NullValueHandling.Ignore;
        return JsonConvert.DeserializeObject<T>(str, settings);
    }

    public static T Deserialize<T>(string str) {
        var settings = new JsonSerializerSettings();
        settings.TypeNameHandling = TypeNameHandling.Auto;
        settings.NullValueHandling = NullValueHandling.Ignore;
        return JsonConvert.DeserializeObject<T>(str, settings);
    }
}