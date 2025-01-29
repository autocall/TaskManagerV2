using AutoMapper;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using TaskManager.Server.Converters;

namespace TaskManager.Server.Mapping;

public class ViewMappingProfile : Profile {
    public ViewMappingProfile() {
        CreateMap<ModelStateDictionary, Dictionary<string, string>>().ConvertUsing<ModelState2ErrorsConverter>();
    }
}