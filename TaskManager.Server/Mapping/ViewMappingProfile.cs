using AutoMapper;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Dtos.Identity;
using TaskManager.Server.Converters;
using TaskManager.Server.Models;

namespace TaskManager.Server.Mapping;

public class ViewMappingProfile : Profile {
    public ViewMappingProfile() {
        CreateMap<ModelStateDictionary, Dictionary<string, string>>().ConvertUsing<ModelState2ErrorsConverter>();
        CreateMap<CreateProjectViewModel, CreateProjectDto>();
        CreateMap<UpdateProjectViewModel, UpdateProjectDto>();

        CreateMap<CreateCategoryViewModel, CreateCategoryDto>();
        CreateMap<UpdateCategoryViewModel, UpdateCategoryDto>();
        CreateMap<UpdateCategoryOrderViewModel, UpdateCategoryOrderDto>();

        CreateMap<CreateEventViewModel, CreateEventDto>();
        CreateMap<UpdateEventViewModel, UpdateEventDto>();

        CreateMap<CreateTaskViewModel, CreateTaskDto>();
        CreateMap<UpdateTaskViewModel, UpdateTaskDto>();

        CreateMap<CreateCommentViewModel, CreateCommentDto>();
        CreateMap<UpdateCommentViewModel, UpdateCommentDto>();

        CreateMap<FilterViewModel, FilterDto>();
    }
}