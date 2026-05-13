import { Controller, Get, Param, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { getRequestId } from '../common/utils/request-id';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('repos')
  listRepos(@Req() req: Request) {
    const repos = this.workspaceService.listRepos();
    return this.apiResponse.success({
      code: 'WORKSPACE_REPOS_FETCHED',
      message: 'Workspace repositories fetched',
      requestId: getRequestId(req),
      data: {
        count: repos.length,
        repos,
      },
    });
  }

  @Get('repos/:repoId')
  getRepo(@Param('repoId') repoId: string, @Req() req: Request) {
    const repo = this.workspaceService.getRepoById(repoId);
    return this.apiResponse.success({
      code: 'WORKSPACE_REPO_FETCHED',
      message: 'Workspace repository fetched',
      requestId: getRequestId(req),
      data: repo,
    });
  }
}
