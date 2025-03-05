using AutoMapper;
using TaskManager.Data.Entities;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Dtos.Identity;
using TaskManager.Logic.Enums;

namespace TaskManager.Logic.Mapping;
public class LogicMappingProfile : Profile {
    public LogicMappingProfile() {
        CreateMap<TmUserDto, TmUser>().ReverseMap();
        CreateMap<TmRoleDto, TmRole>().ReverseMap();
        CreateMap<ProjectDto, Project>().ReverseMap();
        CreateMap<CategoryDto, Category>().ReverseMap();
        CreateMap<EventDto, Event>().CreateMappings().ReverseMap().CreateMappings();

        CreateMap<CreateProjectDto, Project>();
        CreateMap<UpdateProjectDto, Project>();

        CreateMap<CreateCategoryDto, Category>();
        CreateMap<UpdateCategoryDto, Category>();
        CreateMap<UpdateCategoryOrderDto, Category>();

        CreateMap<CreateEventDto, Event>().CreateMappings().ReverseMap().CreateMappings();
        CreateMap<UpdateEventDto, Event>().CreateMappings().ReverseMap().CreateMappings();

    }
}

internal static class LogicMappingProfileExtension {
    internal static IMappingExpression<TDto, TEntity> CreateMappings<TDto, TEntity>(this IMappingExpression<TDto, TEntity> expression)
        where TDto : IEnumEventDtoMap where TEntity : IEnumEventMap {
        return expression
            .ForMember(dest => dest.RepeatType, opt => opt.MapFrom(src => (int)src.RepeatType))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => (int)src.Type));
    }

    internal static IMappingExpression<TEntity, TDto> CreateMappings<TDto, TEntity>(this IMappingExpression<TEntity, TDto> expression)
        where TDto : IEnumEventDtoMap where TEntity : IEnumEventMap {
        return expression
            .ForMember(dest => dest.RepeatType, opt => opt.MapFrom(src => (EventRepeatEnum)src.RepeatType))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => (EventTypeEnum)src.Type));
    }
}