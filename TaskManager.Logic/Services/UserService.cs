using LinqToDB;
using TaskManager.Logic.Dtos.Identity;

namespace TaskManager.Logic.Services;
public class UserService : BaseService {
    public UserService(ServicesHost host) : base(host) { }

    public async Task<List<TmUserDto>> GetByIdsAsync(List<int> userIds) {
        var users = await Host.UserManager.Users.Where(x => userIds.Contains(x.Id)).ToListAsync();
        return Mapper.Map<List<TmUserDto>>(users);
    }
}
