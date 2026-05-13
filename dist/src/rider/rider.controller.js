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
exports.RiderController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const rider_dto_1 = require("./dto/rider.dto");
const rider_service_1 = require("./rider.service");
let RiderController = class RiderController {
    constructor(riderService, apiResponse) {
        this.riderService = riderService;
        this.apiResponse = apiResponse;
    }
    async getMe(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_PROFILE_FETCHED',
            message: 'Rider profile fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getProfile(user.userId),
        });
    }
    async getProfile(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_PROFILE_FETCHED',
            message: 'Rider profile fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getProfile(user.userId),
        });
    }
    async patchMe(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_PROFILE_UPDATED',
            message: 'Rider profile updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.updateProfile(user.userId, body),
        });
    }
    async listTripHistory(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_TRIP_HISTORY_FETCHED',
            message: 'Rider trip history fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listTrips(user.userId),
        });
    }
    async getActiveTrip(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_ACTIVE_TRIP_FETCHED',
            message: 'Rider active trip fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getActiveTrip(user.userId),
        });
    }
    async requestTrip(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_TRIP_REQUESTED',
            message: 'Trip request created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.requestTrip(user.userId, body),
        });
    }
    async updateTripTracking(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_TRIP_TRACKING_UPDATED',
            message: 'Rider trip tracking updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.updateTripTracking(user.userId, tripId, body),
        });
    }
};
exports.RiderController = RiderController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.UpdateRiderProfileDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "patchMe", null);
__decorate([
    (0, common_1.Get)('trips/history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listTripHistory", null);
__decorate([
    (0, common_1.Get)('trips/active'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getActiveTrip", null);
__decorate([
    (0, common_1.Post)('trips/request'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.RequestRiderTripDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "requestTrip", null);
__decorate([
    (0, common_1.Patch)('trips/:tripId/tracking'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, rider_dto_1.UpdateRiderTripTrackingDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "updateTripTracking", null);
exports.RiderController = RiderController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('rider'),
    (0, common_1.Controller)('riders/me'),
    __metadata("design:paramtypes", [rider_service_1.RiderService,
        api_response_service_1.ApiResponseService])
], RiderController);
//# sourceMappingURL=rider.controller.js.map