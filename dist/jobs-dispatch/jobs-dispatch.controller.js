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
exports.JobsDispatchController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const driver_documents_guard_1 = require("../common/auth/driver-documents.guard");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const jobs_dto_1 = require("./dto/jobs.dto");
const jobs_dispatch_service_1 = require("./jobs-dispatch.service");
let JobsDispatchController = class JobsDispatchController {
    constructor(jobsDispatchService, apiResponse) {
        this.jobsDispatchService = jobsDispatchService;
        this.apiResponse = apiResponse;
    }
    async list(user, query, req) {
        return this.apiResponse.success({
            code: 'JOBS_FETCHED',
            message: 'Jobs fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.jobsDispatchService.list(user.driverId, query),
        });
    }
    async getActive(user, req) {
        return this.apiResponse.success({
            code: 'JOB_ACTIVE_FETCHED',
            message: 'Active job fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.jobsDispatchService.getActive(user.driverId),
        });
    }
    async accept(user, jobId, req) {
        return this.apiResponse.success({
            code: 'JOB_ACCEPTED',
            message: 'Job accepted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.jobsDispatchService.accept(user.driverId, jobId),
        });
    }
    async reject(user, jobId, body, req) {
        return this.apiResponse.success({
            code: 'JOB_REJECTED',
            message: 'Job rejected',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.jobsDispatchService.reject(user.driverId, jobId, body.reason),
        });
    }
};
exports.JobsDispatchController = JobsDispatchController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, jobs_dto_1.JobsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], JobsDispatchController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobsDispatchController.prototype, "getActive", null);
__decorate([
    (0, common_1.Post)(':jobId/accept'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('jobId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], JobsDispatchController.prototype, "accept", null);
__decorate([
    (0, common_1.Post)(':jobId/reject'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('jobId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, jobs_dto_1.RejectJobDto, Object]),
    __metadata("design:returntype", Promise)
], JobsDispatchController.prototype, "reject", null);
exports.JobsDispatchController = JobsDispatchController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, driver_documents_guard_1.DriverDocumentsGuard),
    (0, roles_decorator_1.Roles)('driver'),
    (0, common_1.Controller)('drivers/me/jobs'),
    __metadata("design:paramtypes", [jobs_dispatch_service_1.JobsDispatchService,
        api_response_service_1.ApiResponseService])
], JobsDispatchController);
//# sourceMappingURL=jobs-dispatch.controller.js.map