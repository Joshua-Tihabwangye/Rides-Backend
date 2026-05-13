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
exports.PresenceLocationController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const location_dto_1 = require("./dto/location.dto");
const presence_location_service_1 = require("./presence-location.service");
let PresenceLocationController = class PresenceLocationController {
    constructor(presenceLocationService, apiResponse) {
        this.presenceLocationService = presenceLocationService;
        this.apiResponse = apiResponse;
    }
    async goOnline(user, req) {
        return this.apiResponse.success({
            code: 'DRIVER_ONLINE',
            message: 'Driver is now online',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.presenceLocationService.goOnline(user.driverId),
        });
    }
    async goOffline(user, req) {
        return this.apiResponse.success({
            code: 'DRIVER_OFFLINE',
            message: 'Driver is now offline',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.presenceLocationService.goOffline(user.driverId),
        });
    }
    async patchLocation(user, body, req) {
        return this.apiResponse.success({
            code: 'DRIVER_LOCATION_UPDATED',
            message: 'Driver location updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.presenceLocationService.updateLocation(user.driverId, body),
        });
    }
    async heartbeat(user, body, req) {
        return this.apiResponse.success({
            code: 'DRIVER_HEARTBEAT_ACCEPTED',
            message: 'Heartbeat accepted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.presenceLocationService.heartbeat(user.driverId, body),
        });
    }
    async heartbeatCompat(user, body, req) {
        return this.apiResponse.success({
            code: 'DRIVER_HEARTBEAT_ACCEPTED',
            message: 'Heartbeat accepted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.presenceLocationService.heartbeat(user.driverId, body),
        });
    }
};
exports.PresenceLocationController = PresenceLocationController;
__decorate([
    (0, common_1.Post)('drivers/me/presence/online'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PresenceLocationController.prototype, "goOnline", null);
__decorate([
    (0, common_1.Post)('drivers/me/presence/offline'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PresenceLocationController.prototype, "goOffline", null);
__decorate([
    (0, common_1.Patch)('drivers/me/location'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, location_dto_1.UpdateLocationDto, Object]),
    __metadata("design:returntype", Promise)
], PresenceLocationController.prototype, "patchLocation", null);
__decorate([
    (0, common_1.Post)('locations/heartbeat'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, location_dto_1.UpdateLocationDto, Object]),
    __metadata("design:returntype", Promise)
], PresenceLocationController.prototype, "heartbeat", null);
__decorate([
    (0, common_1.Post)('drivers/me/location/heartbeat'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, location_dto_1.UpdateLocationDto, Object]),
    __metadata("design:returntype", Promise)
], PresenceLocationController.prototype, "heartbeatCompat", null);
exports.PresenceLocationController = PresenceLocationController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('driver'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [presence_location_service_1.PresenceLocationService,
        api_response_service_1.ApiResponseService])
], PresenceLocationController);
//# sourceMappingURL=presence-location.controller.js.map