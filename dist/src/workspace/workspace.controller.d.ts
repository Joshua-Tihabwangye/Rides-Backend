import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { WorkspaceService } from './workspace.service';
export declare class WorkspaceController {
    private readonly workspaceService;
    private readonly apiResponse;
    constructor(workspaceService: WorkspaceService, apiResponse: ApiResponseService);
    listRepos(req: Request): import("../common/api/api.types").ApiSuccessResponse<{
        count: number;
        repos: import("./workspace.service").WorkspaceRepoView[];
    }>;
    getRepo(repoId: string, req: Request): import("../common/api/api.types").ApiSuccessResponse<import("./workspace.service").WorkspaceRepoView | null>;
}
