export interface WorkspaceRepoView {
    id: string;
    name: string;
    path: string;
    type: string;
    hasGit: boolean;
    hasPackageJson: boolean;
    hasBackend: boolean;
}
export declare class WorkspaceService {
    private readonly configFileName;
    listRepos(): WorkspaceRepoView[];
    getRepoById(id: string): WorkspaceRepoView | null;
    private readConfiguredRepos;
    private toView;
    private scanWorkspaceParent;
}
