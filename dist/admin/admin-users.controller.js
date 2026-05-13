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
exports.AdminUsersController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const admin_dto_1 = require("./dto/admin.dto");
const admin_service_1 = require("./admin.service");
let AdminUsersController = class AdminUsersController {
    constructor(adminService, apiResponse) {
        this.adminService = adminService;
        this.apiResponse = apiResponse;
    }
    async listRiders(req) {
        return this.apiResponse.success({
            code: 'ADMIN_RIDERS_FETCHED',
            message: 'Riders fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listRiders(),
        });
    }
    async getRider(riderId, req) {
        return this.apiResponse.success({
            code: 'ADMIN_RIDER_FETCHED',
            message: 'Rider fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getRider(riderId),
        });
    }
    async createRider(user, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_RIDER_CREATED',
            message: 'Rider created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.createRider(user.userId, { email: body.email, phone: body.phone, fullName: body.fullName, city: body.city, country: body.country }, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async patchRider(user, riderId, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_RIDER_UPDATED',
            message: 'Rider updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.patchRider(user.userId, riderId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async listDrivers(req) {
        return this.apiResponse.success({
            code: 'ADMIN_DRIVERS_FETCHED',
            message: 'Drivers fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listDrivers(),
        });
    }
    async getDriver(driverId, req) {
        return this.apiResponse.success({
            code: 'ADMIN_DRIVER_FETCHED',
            message: 'Driver fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getDriver(driverId),
        });
    }
    async createDriver(user, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_DRIVER_CREATED',
            message: 'Driver created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.createDriver(user.userId, { email: body.email, phone: body.phone, fullName: body.fullName, city: body.city, country: body.country }, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async patchDriver(user, driverId, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_DRIVER_UPDATED',
            message: 'Driver updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.patchDriver(user.userId, driverId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async listUsers(req) {
        return this.apiResponse.success({
            code: 'ADMIN_USERS_FETCHED',
            message: 'Users fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listUsers(),
        });
    }
    async createUser(user, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_USER_CREATED',
            message: 'User created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.createUser(user.userId, { ...body, roles: body.roles ?? ['rider'] }, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async patchUser(user, targetUserId, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_USER_UPDATED',
            message: 'User updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.patchUser(user.userId, targetUserId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async listRoles(req) {
        return this.apiResponse.success({
            code: 'ADMIN_ROLES_FETCHED',
            message: 'Roles fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listRoles(),
        });
    }
    async createRole(user, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_ROLE_CREATED',
            message: 'Role created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.createRole(user.userId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async patchRole(user, roleId, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_ROLE_UPDATED',
            message: 'Role updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.patchRole(user.userId, roleId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
};
exports.AdminUsersController = AdminUsersController;
__decorate([
    (0, common_1.Get)('riders'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "listRiders", null);
__decorate([
    (0, common_1.Get)('riders/:riderId'),
    __param(0, (0, common_1.Param)('riderId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "getRider", null);
__decorate([
    (0, common_1.Post)('riders'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreateAdminUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "createRider", null);
__decorate([
    (0, common_1.Patch)('riders/:riderId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('riderId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdateAdminUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "patchRider", null);
__decorate([
    (0, common_1.Get)('drivers'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "listDrivers", null);
__decorate([
    (0, common_1.Get)('drivers/:driverId'),
    __param(0, (0, common_1.Param)('driverId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "getDriver", null);
__decorate([
    (0, common_1.Post)('drivers'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreateAdminUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "createDriver", null);
__decorate([
    (0, common_1.Patch)('drivers/:driverId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('driverId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdateAdminUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "patchDriver", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreateAdminUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)('users/:userId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdateAdminUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "patchUser", null);
__decorate([
    (0, common_1.Get)('roles'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "listRoles", null);
__decorate([
    (0, common_1.Post)('roles'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreateAdminRoleDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "createRole", null);
__decorate([
    (0, common_1.Patch)('roles/:roleId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdateAdminRoleDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "patchRole", null);
exports.AdminUsersController = AdminUsersController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        api_response_service_1.ApiResponseService])
], AdminUsersController);
//# sourceMappingURL=admin-users.controller.js.map