using Microsoft.EntityFrameworkCore;
using TaskManager.Data.Entities;
using TaskManager.Data.Repositories;
using TaskManager.Logic.Dtos;

namespace TaskManager.Logic.Services;
public class CommentService : BaseService {
    //private IRepository<Comment> Rep(int companyId) => base.Rep<Comment>(companyId);

    public CommentService(ServicesHost host) : base(host) { }

    public async Task<List<CommentDto>> GetAllAsync(FilterDto filter, int companyId) {
        var comments = new List<CommentDto>() {
            new CommentDto(){
                Id = 11,
                TaskId = 3,
                DateTime = DateTime.UtcNow,
                WorkHours = 1,
                Text = "исправленный алгоритм сработал, email изменился. так же синхронизируются очень много свойств",
                CreatedById = TmUser.AdminUserId,
            },
            new CommentDto() {
                Id = 12,
                TaskId = 3,
                DateTime = DateTime.UtcNow.AddDays(-6),
                WorkHours = 2,
                Text = "Comment 2",
                CreatedById = TmUser.SystemUserId,
            },
            new CommentDto() {
                Id = 13,
                TaskId = 5,
                DateTime = DateTime.UtcNow.AddDays(-50),
                WorkHours = 0.5m,
                Text = "сервер перезапускался 16го января в 0:00 несколько раз. в это время запускаются процессы, какой то из них повесил сервер, скорей всего скачивание всех MailBox. этот процесс работает раз в неделю, если повторится значит надо будет его править",
            },
        };
        return comments;
    }
}
