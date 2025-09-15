using LinqToDB;
using LinqToDB.EntityFrameworkCore;
using TaskManager.Common.Exceptions;
using TaskManager.Data.Entities;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.WebServices;

namespace TaskManager.Logic.Services;
public class GitHubService : BaseService {

    private GitHubWebService WebService => Host.GetService<GitHubWebService>();

    public GitHubService(ServicesHost host) : base(host) {
    }

    public async Task<GitHubCommitDto> GetCommitAsync(int taskId, string commitHash, int userId, int companyId) {
        if (commitHash == null) {
            return null;
        }
        var user = await Host.UserManager.FindByIdAsync(userId.ToString());
        if (user.GitHubOwner == null || user.GitHubToken == null) {
            return null;
        }
        var projectId = await UnitOfWork.GetRepository<Task1>(companyId)
            .GetAll(false)
            .Where(r => r.Id == taskId)
            .Select(x => x.ProjectId)
            .FirstOrDefaultAsyncLinqToDB();
        if (projectId == null) {
            throw new Exception("Undefined task");
        }
        var project = await UnitOfWork.GetRepository<Project>(companyId).GetByIdAsync(projectId.Value);
        if (project == null) {
            throw new Exception("Undefined project");
        }
        if (project.GitHubRepo == null) {
            throw new InfoException($"Undefined 'GitHub Repo' for the project '{project.Name}'");
        }
        var response = await this.WebService.GetCommintAsync(user.GitHubOwner, project.GitHubRepo, commitHash, user.GitHubToken);
        if (response.Success == false) {
            throw new InfoException($"[Code:{(int)response.StatusCode}] {response.ErrorMessage}");
        }
        var dto = Mapper.Map<GitHubCommitDto>(response.Data);
        return dto;
    }
}
