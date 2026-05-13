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
exports.FleetController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const fleet_dto_1 = require("./dto/fleet.dto");
const fleet_service_1 = require("./fleet.service");
let FleetController = class FleetController {
    constructor(fleetService, apiResponse) {
        this.fleetService = fleetService;
        this.apiResponse = apiResponse;
    }
    async getProfile(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_PROFILE_FETCHED',
            message: 'Fleet profile fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getProfile(user.userId),
        });
    }
    async patchProfile(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_PROFILE_UPDATED',
            message: 'Fleet profile updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.updateProfile(user.userId, body),
        });
    }
    async listBranches(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_BRANCHES_FETCHED',
            message: 'Fleet branches fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listBranches(user.userId),
        });
    }
    async getBranchById(user, branchId, req) {
        return this.apiResponse.success({
            code: 'FLEET_BRANCH_FETCHED',
            message: 'Fleet branch fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getBranchById(user.userId, branchId),
        });
    }
    async createBranch(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_BRANCH_CREATED',
            message: 'Fleet branch created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.createBranch(user.userId, body),
        });
    }
    async patchBranch(user, branchId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_BRANCH_UPDATED',
            message: 'Fleet branch updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.patchBranch(user.userId, branchId, body),
        });
    }
    async deleteBranch(user, branchId, req) {
        return this.apiResponse.success({
            code: 'FLEET_BRANCH_DELETED',
            message: 'Fleet branch deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.deleteBranch(user.userId, branchId),
        });
    }
};
exports.FleetController = FleetController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.UpdateFleetProfileDto, Object]),
    __metadata("design:returntype", Promise)
], FleetController.prototype, "patchProfile", null);
__decorate([
    (0, common_1.Get)('branches'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetController.prototype, "listBranches", null);
__decorate([
    (0, common_1.Get)('branches/:branchId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('branchId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetController.prototype, "getBranchById", null);
__decorate([
    (0, common_1.Post)('branches'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.UpsertFleetBranchDto, Object]),
    __metadata("design:returntype", Promise)
], FleetController.prototype, "createBranch", null);
__decorate([
    (0, common_1.Patch)('branches/:branchId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('branchId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, fleet_dto_1.PatchFleetBranchDto, Object]),
    __metadata("design:returntype", Promise)
], FleetController.prototype, "patchBranch", null);
__decorate([
    (0, common_1.Delete)('branches/:branchId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('branchId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetController.prototype, "deleteBranch", null);
exports.FleetController = FleetController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('fleet_owner', 'fleet_manager', 'fleet_dispatcher', 'fleet_finance'),
    (0, common_1.Controller)('fleet/me'),
    __metadata("design:paramtypes", [fleet_service_1.FleetService,
        api_response_service_1.ApiResponseService])
], FleetController);
//# sourceMappingURL=fleet.controller.js.map