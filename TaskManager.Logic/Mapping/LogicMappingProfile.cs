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
        CreateMap<CompanyDto, Company>().ReverseMap();
        CreateMap<ProjectDto, Project>().ReverseMap();
        CreateMap<CategoryDto, Category>().ReverseMap();
        CreateMap<TaskDto, Task1>().CreateTaskMappings().ReverseMap().CreateTaskMappings();
        CreateMap<CommentDto, Comment>().ReverseMap();
        CreateMap<EventDto, Event>().CreateEventMappings().ReverseMap().CreateEventMappings();

        CreateMap<CreateProjectDto, Project>();
        CreateMap<UpdateProjectDto, Project>();

        CreateMap<CreateCategoryDto, Category>();
        CreateMap<UpdateCategoryDto, Category>();
        CreateMap<UpdateCategoryOrderDto, Category>();

        CreateMap<CreateTaskDto, Task1>();
        CreateMap<UpdateTaskDto, Task1>();

        CreateMap<CreateCommentDto, Comment>();
        CreateMap<UpdateCommentDto, Comment>();

        CreateMap<CreateEventDto, Event>().CreateEventMappings().ReverseMap().CreateEventMappings();
        CreateMap<UpdateEventDto, Event>().CreateEventMappings().ReverseMap().CreateEventMappings();

        CreateMap<CreateTaskDto, Task1>().CreateTaskMappings().ReverseMap().CreateTaskMappings();
        CreateMap<UpdateTaskDto, Task1>().CreateTaskMappings().ReverseMap().CreateTaskMappings();
    }
}

internal static class LogicMappingProfileExtension {
    internal static IMappingExpression<TDto, TEntity> CreateEventMappings<TDto, TEntity>(this IMappingExpression<TDto, TEntity> expression)
        where TDto : IEnumEventDtoMap where TEntity : IEnumEventMap {
        return expression
            .ForMember(dest => dest.RepeatType, opt => opt.MapFrom(src => (int)src.RepeatType))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => (int)src.Type));
    }

    internal static IMappingExpression<TEntity, TDto> CreateEventMappings<TDto, TEntity>(this IMappingExpression<TEntity, TDto> expression)
        where TDto : IEnumEventDtoMap where TEntity : IEnumEventMap {
        return expression
            .ForMember(dest => dest.RepeatType, opt => opt.MapFrom(src => (EventRepeatEnum)src.RepeatType))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => (EventTypeEnum)src.Type));
    }

    internal static IMappingExpression<TDto, TEntity> CreateTaskMappings<TDto, TEntity>(this IMappingExpression<TDto, TEntity> expression)
        where TDto : IEnumTaskDtoMap where TEntity : IEnumTaskMap {
        return expression
            .ForMember(dest => dest.Column, opt => opt.MapFrom(src => (int)src.Column))
            .ForMember(dest => dest.Kind, opt => opt.MapFrom(src => (int)src.Kind))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => (int)src.Status));
    }

    internal static IMappingExpression<TEntity, TDto> CreateTaskMappings<TDto, TEntity>(this IMappingExpression<TEntity, TDto> expression)
        where TDto : IEnumTaskDtoMap where TEntity : IEnumTaskMap {
        return expression
            .ForMember(dest => dest.Column, opt => opt.MapFrom(src => (TaskColumnEnum)src.Column))
            .ForMember(dest => dest.Kind, opt => opt.MapFrom(src => (TaskKindEnum)src.Kind))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => (TaskStatusEnum)src.Status));
    }
}