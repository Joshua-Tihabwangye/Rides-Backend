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
exports.TripsController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const driver_documents_guard_1 = require("../common/auth/driver-documents.guard");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const trips_dto_1 = require("./dto/trips.dto");
const trips_service_1 = require("./trips.service");
let TripsController = class TripsController {
    constructor(tripsService, apiResponse) {
        this.tripsService = tripsService;
        this.apiResponse = apiResponse;
    }
    async getActive(user, req) {
        return this.apiResponse.success({
            code: 'TRIP_ACTIVE_FETCHED',
            message: 'Active trip fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.tripsService.getActive(user.driverId),
        });
    }
    async list(user, query, req) {
        return this.apiResponse.success({
            code: 'TRIPS_FETCHED',
            message: 'Trips fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.tripsService.list(user.driverId, query),
        });
    }
    async getById(user, tripId, req) {
        return this.apiResponse.success({
            code: 'TRIP_FETCHED',
            message: 'Trip fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.tripsService.getById(user.driverId, tripId),
        });
    }
    async arrive(user, tripId, req) {
        return this.apiResponse.success({
            code: 'TRIP_ARRIVED',
            message: 'Driver marked as arrived',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.tripsService.arrive(user.driverId, tripId),
        });
    }
    async verifyRider(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'TRIP_RIDER_VERIFIED',
            message: 'Rider verified',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.tripsService.verifyRider(user.driverId, tripId, body.otp),
        });
    }
    async start(user, tripId, req) {
        return this.apiResponse.success({
            code: 'TRIP_STARTED',
            message: 'Trip started',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.tripsService.start(user.driverId, tripId),
        });
    }
    async complete(user, tripId, req) {
        return this.apiResponse.success({
            code: 'TRIP_COMPLETED',
            message: 'Trip completed',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.tripsService.complete(user.driverId, tripId),
        });
    }
    async cancel(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'TRIP_CANCELLED',
            message: 'Trip cancelled',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.tripsService.cancel(user.driverId, tripId, body.reason, body.details, body.cancelledBy),
        });
    }
};
exports.TripsController = TripsController;
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "getActive", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trips_dto_1.TripsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':tripId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(':tripId/arrive'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "arrive", null);
__decorate([
    (0, common_1.Post)(':tripId/verify-rider'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, trips_dto_1.VerifyRiderDto, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "verifyRider", null);
__decorate([
    (0, common_1.Post)(':tripId/start'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "start", null);
__decorate([
    (0, common_1.Post)(':tripId/complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':tripId/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, trips_dto_1.CancelTripDto, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "cancel", null);
exports.TripsController = TripsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, driver_documents_guard_1.DriverDocumentsGuard),
    (0, roles_decorator_1.Roles)('driver'),
    (0, common_1.Controller)('drivers/me/trips'),
    __metadata("design:paramtypes", [trips_service_1.TripsService,
        api_response_service_1.ApiResponseService])
], TripsController);
//# sourceMappingURL=trips.controller.js.map