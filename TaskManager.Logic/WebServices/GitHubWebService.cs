using System.Net;
using System.Net.Http.Headers;
using TaskManager.Common.Extensions;
using TaskManager.Logic.WebServices.Responses;

namespace TaskManager.Logic.WebServices;
public class GitHubWebService : BaseWebService {
    private static string GetCommit(string owner, string repo, string sha) => $"https://api.github.com/repos/{owner}/{repo}/commits/{sha}";

    public GitHubWebService(ServicesHost host) { }

    // GET https://api.github.com/repos/{owner}/{repo}/commits/{commit_sha}
    public async Task<ApiResult<GitHubCommitResponse>> GetCommintAsync(
            string owner, string repo, string sha, string token, CancellationToken ct = default) {
        try {
            using var req = new HttpRequestMessage(HttpMethod.Get, GetCommit(owner, repo, sha));
            req.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));
            req.Headers.UserAgent.ParseAdd("TaskManager-App");
            if (!string.IsNullOrWhiteSpace(token))
                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            using var http = new HttpClient();
            using var resp = await http.SendAsync(req, HttpCompletionOption.ResponseHeadersRead, ct);
            if (!resp.IsSuccessStatusCode) {
                var body = await resp.Content.ReadAsStringAsync(ct);
                throw new HttpRequestException($"GitHub API [{(int)resp.StatusCode}] {resp.ReasonPhrase}: {body}");
            }

            var json = await resp.Content.ReadAsStringAsync();
            var raw = JsonExtension.Deserialize<GitHubCommitResponse>(json);
            return ApiResult<GitHubCommitResponse>.Successed(raw);
        } catch (WebException e) {
            return ApiResult<GitHubCommitResponse>.Failed(e);
        } catch (Exception e) {
            return ApiResult<GitHubCommitResponse>.Failed(e);
        }
    }
}

