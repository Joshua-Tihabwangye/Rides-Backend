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
exports.DriverProfileController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const driver_profile_service_1 = require("./driver-profile.service");
const driver_profile_dto_1 = require("./dto/driver-profile.dto");
let DriverProfileController = class DriverProfileController {
    constructor(driverProfileService, apiResponse) {
        this.driverProfileService = driverProfileService;
        this.apiResponse = apiResponse;
    }
    async getMe(user, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'DRIVER_PROFILE_FETCHED',
            message: 'Driver profile fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.driverProfileService.getProfile(driverId),
        });
    }
    async patchMe(user, body, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'DRIVER_PROFILE_UPDATED',
            message: 'Driver profile updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.driverProfileService.updateProfile(driverId, body),
        });
    }
    async getPreferences(user, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'DRIVER_PREFERENCES_FETCHED',
            message: 'Driver preferences fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.driverProfileService.getPreferences(driverId),
        });
    }
    async patchPreferences(user, body, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'DRIVER_PREFERENCES_UPDATED',
            message: 'Driver preferences updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.driverProfileService.updatePreferences(driverId, body),
        });
    }
};
exports.DriverProfileController = DriverProfileController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DriverProfileController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, driver_profile_dto_1.UpdateDriverProfileDto, Object]),
    __metadata("design:returntype", Promise)
], DriverProfileController.prototype, "patchMe", null);
__decorate([
    (0, common_1.Get)('preferences'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DriverProfileController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Patch)('preferences'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, driver_profile_dto_1.UpdateDriverPreferencesDto, Object]),
    __metadata("design:returntype", Promise)
], DriverProfileController.prototype, "patchPreferences", null);
exports.DriverProfileController = DriverProfileController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('driver'),
    (0, common_1.Controller)('drivers/me'),
    __metadata("design:paramtypes", [driver_profile_service_1.DriverProfileService,
        api_response_service_1.ApiResponseService])
], DriverProfileController);
//# sourceMappingURL=driver-profile.controller.js.map