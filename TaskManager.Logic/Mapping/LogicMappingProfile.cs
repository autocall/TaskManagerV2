using AutoMapper;
using TaskManager.Data.Entities;
using TaskManager.Logic.Dtos.Identity;

namespace TaskManager.Logic.Mapping;
public class LogicMappingProfile : Profile {
    public LogicMappingProfile() {
        CreateMap<TmUserDto, TmUser>().ReverseMap();
    }
}