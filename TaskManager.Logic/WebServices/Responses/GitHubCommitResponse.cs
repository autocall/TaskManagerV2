using System.Text.Json.Serialization;

namespace TaskManager.Logic.WebServices.Responses;
public record GitHubCommitResponse(
    string Sha,
    [property: JsonPropertyName("html_url")] string HtmlUrl,
    GitHubCommitInfo Commit,
    GitHubCommitStats Stats,
    List<GitHubCommitFile> Files
);

public record GitHubCommitInfo(
    GitHubCommitAuthor Author,
    string Message
);

public record GitHubCommitAuthor(
    string Name,
    string Email,
    DateTime Date
);

public record GitHubCommitStats(
    int Total,
    int Additions,
    int Deletions
);

public record GitHubCommitFile(
    string Filename,
    string Status,
    int Additions,
    int Deletions,
    int Changes,
    [property: JsonPropertyName("blob_url")] string BlobUrl,
    [property: JsonPropertyName("raw_url")] string RawUrl
);
