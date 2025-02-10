using AutoMapper;
using TaskManager.Data.Entities;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Dtos.Identity;

namespace TaskManager.Logic.Mapping;
public class LogicMappingProfile : Profile {
    public LogicMappingProfile() {
        CreateMap<TmUserDto, TmUser>().ReverseMap();
        CreateMap<TmRoleDto, TmRole>().ReverseMap();
        CreateMap<ProjectDto, Project>().ReverseMap();

        CreateMap<CreateProjectDto, Project>();
        CreateMap<UpdateProjectDto, Project>();

    }
}