export class ProfileGitHubModel {
    public GitHubOwner: string;
    public GitHubToken: string;

    constructor(data: any) {
        this.GitHubOwner = data.GitHubOwner;
        this.GitHubToken = data.GitHubToken;
    }
}
