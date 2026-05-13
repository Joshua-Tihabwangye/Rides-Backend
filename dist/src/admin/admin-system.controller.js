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
exports.AdminSystemController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const admin_dto_1 = require("./dto/admin.dto");
const admin_service_1 = require("./admin.service");
let AdminSystemController = class AdminSystemController {
    constructor(adminService, apiResponse) {
        this.adminService = adminService;
        this.apiResponse = apiResponse;
    }
    async getAuditLog(req) {
        return this.apiResponse.success({
            code: 'ADMIN_AUDIT_LOG_FETCHED',
            message: 'Audit log fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getAuditLog(),
        });
    }
    async getFlags(req) {
        return this.apiResponse.success({
            code: 'ADMIN_FLAGS_FETCHED',
            message: 'Feature flags fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getFlags(),
        });
    }
    async patchFlag(user, flagKey, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_FLAG_UPDATED',
            message: 'Feature flag updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.patchFeatureFlag(user.userId, flagKey, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async getHealth(req) {
        return this.apiResponse.success({
            code: 'ADMIN_SYSTEM_HEALTH_FETCHED',
            message: 'System health fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getHealth(),
        });
    }
    async getOverview(req) {
        return this.apiResponse.success({
            code: 'ADMIN_SYSTEM_OVERVIEW_FETCHED',
            message: 'System overview fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getOverview(),
        });
    }
};
exports.AdminSystemController = AdminSystemController;
__decorate([
    (0, common_1.Get)('audit-log'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminSystemController.prototype, "getAuditLog", null);
__decorate([
    (0, common_1.Get)('flags'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminSystemController.prototype, "getFlags", null);
__decorate([
    (0, common_1.Patch)('flags/:flagKey'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('flagKey')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdateFeatureFlagDto, Object]),
    __metadata("design:returntype", Promise)
], AdminSystemController.prototype, "patchFlag", null);
__decorate([
    (0, common_1.Get)('health'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminSystemController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminSystemController.prototype, "getOverview", null);
exports.AdminSystemController = AdminSystemController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    (0, common_1.Controller)('admin/system'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        api_response_service_1.ApiResponseService])
], AdminSystemController);
//# sourceMappingURL=admin-system.controller.js.map