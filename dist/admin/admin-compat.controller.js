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
exports.AdminCompatController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const admin_dto_1 = require("./dto/admin.dto");
const admin_service_1 = require("./admin.service");
let AdminCompatController = class AdminCompatController {
    constructor(adminService, apiResponse) {
        this.adminService = adminService;
        this.apiResponse = apiResponse;
    }
    async getFeatureFlags(req) {
        return this.apiResponse.success({
            code: 'ADMIN_FLAGS_FETCHED',
            message: 'Feature flags fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getFlags(),
        });
    }
    async patchFeatureFlag(user, flagKey, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_FLAG_UPDATED',
            message: 'Feature flag updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.patchFeatureFlag(user.userId, flagKey, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async getAuditEvents(req) {
        return this.apiResponse.success({
            code: 'ADMIN_AUDIT_LOG_FETCHED',
            message: 'Audit events fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getAuditLog(),
        });
    }
    async listRiskCases(req) {
        return this.apiResponse.success({
            code: 'ADMIN_RISK_CASES_FETCHED',
            message: 'Risk cases fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listRiskCases(),
        });
    }
    async getRiskCase(caseId, req) {
        return this.apiResponse.success({
            code: 'ADMIN_RISK_CASE_FETCHED',
            message: 'Risk case fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getRiskCase(caseId),
        });
    }
    async reviewApprovalCompat(user, approvalId, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_APPROVAL_REVIEWED',
            message: 'Approval reviewed',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.reviewApproval(user.userId, approvalId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
};
exports.AdminCompatController = AdminCompatController;
__decorate([
    (0, common_1.Get)('feature-flags'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCompatController.prototype, "getFeatureFlags", null);
__decorate([
    (0, common_1.Patch)('feature-flags/:flagKey'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('flagKey')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdateFeatureFlagDto, Object]),
    __metadata("design:returntype", Promise)
], AdminCompatController.prototype, "patchFeatureFlag", null);
__decorate([
    (0, common_1.Get)('audit-events'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCompatController.prototype, "getAuditEvents", null);
__decorate([
    (0, common_1.Get)('risk-cases'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCompatController.prototype, "listRiskCases", null);
__decorate([
    (0, common_1.Get)('risk-cases/:caseId'),
    __param(0, (0, common_1.Param)('caseId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminCompatController.prototype, "getRiskCase", null);
__decorate([
    (0, common_1.Post)('approvals/:approvalId/review'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('approvalId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.ReviewApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], AdminCompatController.prototype, "reviewApprovalCompat", null);
exports.AdminCompatController = AdminCompatController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        api_response_service_1.ApiResponseService])
], AdminCompatController);
//# sourceMappingURL=admin-compat.controller.js.map