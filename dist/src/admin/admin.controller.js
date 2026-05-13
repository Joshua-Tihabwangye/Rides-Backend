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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const admin_dto_1 = require("./dto/admin.dto");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(adminService, apiResponse) {
        this.adminService = adminService;
        this.apiResponse = apiResponse;
    }
    async getProfile(user, req) {
        return this.apiResponse.success({
            code: 'ADMIN_PROFILE_FETCHED',
            message: 'Admin profile fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getProfile(user.userId),
        });
    }
    async patchProfile(user, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_PROFILE_UPDATED',
            message: 'Admin profile updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.updateProfile(user.userId, body),
        });
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.UpdateAdminProfileDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "patchProfile", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    (0, common_1.Controller)('admins/me'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        api_response_service_1.ApiResponseService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map