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
exports.VehiclesController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const vehicle_dto_1 = require("./dto/vehicle.dto");
const vehicles_service_1 = require("./vehicles.service");
let VehiclesController = class VehiclesController {
    constructor(vehiclesService, apiResponse) {
        this.vehiclesService = vehiclesService;
        this.apiResponse = apiResponse;
    }
    async list(user, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'VEHICLES_FETCHED',
            message: 'Vehicles fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.list(driverId),
        });
    }
    async create(user, body, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'VEHICLE_CREATED',
            message: 'Vehicle created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.create(driverId, { ...body, status: body.status ?? 'inactive' }),
        });
    }
    async getById(user, vehicleId, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'VEHICLE_FETCHED',
            message: 'Vehicle fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.findById(driverId, vehicleId),
        });
    }
    async patch(user, vehicleId, body, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'VEHICLE_UPDATED',
            message: 'Vehicle updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.update(driverId, vehicleId, body),
        });
    }
    async remove(user, vehicleId, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'VEHICLE_DELETED',
            message: 'Vehicle deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.remove(driverId, vehicleId),
        });
    }
    async patchAccessories(user, vehicleId, body, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'VEHICLE_ACCESSORIES_UPDATED',
            message: 'Vehicle accessories updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.patchAccessories(driverId, vehicleId, body.accessories),
        });
    }
    async postDocument(user, vehicleId, body, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'VEHICLE_DOCUMENT_UPLOADED',
            message: 'Vehicle document uploaded',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.uploadDocument(driverId, vehicleId, body),
        });
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vehicle_dto_1.CreateVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':vehicleId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('vehicleId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':vehicleId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('vehicleId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vehicle_dto_1.UpdateVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)(':vehicleId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('vehicleId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':vehicleId/accessories'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('vehicleId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vehicle_dto_1.UpdateAccessoriesDto, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "patchAccessories", null);
__decorate([
    (0, common_1.Post)(':vehicleId/documents'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('vehicleId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vehicle_dto_1.UploadVehicleDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "postDocument", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('driver'),
    (0, common_1.Controller)('drivers/me/vehicles'),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService,
        api_response_service_1.ApiResponseService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map