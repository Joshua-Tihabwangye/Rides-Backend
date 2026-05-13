"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const request_id_1 = require("../common/utils/request-id");
const workspace_service_1 = require("./workspace.service");
let WorkspaceController = class WorkspaceController {
    constructor(workspaceService, apiResponse) {
        this.workspaceService = workspaceService;
        this.apiResponse = apiResponse;
    }
    listRepos(req) {
        const repos = this.workspaceService.listRepos();
        return this.apiResponse.success({
            code: 'WORKSPACE_REPOS_FETCHED',
            message: 'Workspace repositories fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: {
                count: repos.length,
                repos,
            },
        });
    }
    getRepo(repoId, req) {
        const repo = this.workspaceService.getRepoById(repoId);
        return this.apiResponse.success({
            code: 'WORKSPACE_REPO_FETCHED',
            message: 'Workspace repository fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: repo,
        });
    }
};
exports.WorkspaceController = WorkspaceController;
__decorate([
    (0, common_1.Get)('repos'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "listRepos", null);
__decorate([
    (0, common_1.Get)('repos/:repoId'),
    __param(0, (0, common_1.Param)('repoId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "getRepo", null);
exports.WorkspaceController = WorkspaceController = __decorate([
    (0, common_1.Controller)('workspace'),
    __metadata("design:paramtypes", [workspace_service_1.WorkspaceService,
        api_response_service_1.ApiResponseService])
], WorkspaceController);
//# sourceMappingURL=workspace.controller.js.map