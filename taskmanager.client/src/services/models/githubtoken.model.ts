export class ProfileGitHubTokenModel {
    public GitHubToken: string;

    constructor(data: any) {
        this.GitHubToken = data.GitHubToken;
    }
}
