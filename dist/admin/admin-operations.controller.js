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
exports.AdminOperationsController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const admin_dto_1 = require("./dto/admin.dto");
const admin_service_1 = require("./admin.service");
let AdminOperationsController = class AdminOperationsController {
    constructor(adminService, apiResponse) {
        this.adminService = adminService;
        this.apiResponse = apiResponse;
    }
    async listCompanies(req) {
        return this.apiResponse.success({
            code: 'ADMIN_COMPANIES_FETCHED',
            message: 'Companies fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listCompanies(),
        });
    }
    async getCompany(companyId, req) {
        return this.apiResponse.success({
            code: 'ADMIN_COMPANY_FETCHED',
            message: 'Company fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getCompany(companyId),
        });
    }
    async createCompany(user, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_COMPANY_CREATED',
            message: 'Company created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.createCompany(user.userId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async patchCompany(user, companyId, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_COMPANY_UPDATED',
            message: 'Company updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.patchCompany(user.userId, companyId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async listApprovals(req) {
        return this.apiResponse.success({
            code: 'ADMIN_APPROVALS_FETCHED',
            message: 'Approvals fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listApprovals(),
        });
    }
    async getApproval(approvalId, req) {
        return this.apiResponse.success({
            code: 'ADMIN_APPROVAL_FETCHED',
            message: 'Approval fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getApproval(approvalId),
        });
    }
    async reviewApproval(user, approvalId, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_APPROVAL_REVIEWED',
            message: 'Approval reviewed',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.reviewApproval(user.userId, approvalId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async getOperationsAnalytics(query, req) {
        return this.apiResponse.success({
            code: 'ADMIN_ANALYTICS_OPERATIONS_FETCHED',
            message: 'Operations analytics fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getOperationsAnalytics(query.period),
        });
    }
    async getFinanceAnalytics(query, req) {
        return this.apiResponse.success({
            code: 'ADMIN_ANALYTICS_FINANCE_FETCHED',
            message: 'Finance analytics fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getFinanceAnalytics(query.period),
        });
    }
    async listSafetyIncidents(req) {
        return this.apiResponse.success({
            code: 'ADMIN_SAFETY_INCIDENTS_FETCHED',
            message: 'Safety incidents fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listSafetyIncidents(),
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
    async listRiderServiceRequests(serviceType, status, riderId, req) {
        return this.apiResponse.success({
            code: 'ADMIN_RIDER_SERVICES_FETCHED',
            message: 'Rider service requests fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listRiderServiceRequests({ serviceType, status, riderId }),
        });
    }
    async getRiderServiceRequest(requestId, req) {
        return this.apiResponse.success({
            code: 'ADMIN_RIDER_SERVICE_FETCHED',
            message: 'Rider service request fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getRiderServiceRequest(requestId),
        });
    }
};
exports.AdminOperationsController = AdminOperationsController;
__decorate([
    (0, common_1.Get)('companies'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "listCompanies", null);
__decorate([
    (0, common_1.Get)('companies/:companyId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "getCompany", null);
__decorate([
    (0, common_1.Post)('companies'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreateAdminCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "createCompany", null);
__decorate([
    (0, common_1.Patch)('companies/:companyId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('companyId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdateAdminCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "patchCompany", null);
__decorate([
    (0, common_1.Get)('approvals'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "listApprovals", null);
__decorate([
    (0, common_1.Get)('approvals/:approvalId'),
    __param(0, (0, common_1.Param)('approvalId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "getApproval", null);
__decorate([
    (0, common_1.Patch)('approvals/:approvalId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('approvalId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.ReviewApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "reviewApproval", null);
__decorate([
    (0, common_1.Get)('analytics/operations'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.AdminAnalyticsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "getOperationsAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/finance'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.AdminAnalyticsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "getFinanceAnalytics", null);
__decorate([
    (0, common_1.Get)('safety/incidents'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "listSafetyIncidents", null);
__decorate([
    (0, common_1.Get)('risk/cases'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "listRiskCases", null);
__decorate([
    (0, common_1.Get)('risk/cases/:caseId'),
    __param(0, (0, common_1.Param)('caseId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "getRiskCase", null);
__decorate([
    (0, common_1.Get)('rider-services'),
    __param(0, (0, common_1.Query)('serviceType')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('riderId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "listRiderServiceRequests", null);
__decorate([
    (0, common_1.Get)('rider-services/:requestId'),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminOperationsController.prototype, "getRiderServiceRequest", null);
exports.AdminOperationsController = AdminOperationsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        api_response_service_1.ApiResponseService])
], AdminOperationsController);
//# sourceMappingURL=admin-operations.controller.js.map