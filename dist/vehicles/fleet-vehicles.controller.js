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
exports.FleetVehiclesController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const vehicle_dto_1 = require("./dto/vehicle.dto");
const vehicles_service_1 = require("./vehicles.service");
let FleetVehiclesController = class FleetVehiclesController {
    constructor(vehiclesService, apiResponse) {
        this.vehiclesService = vehiclesService;
        this.apiResponse = apiResponse;
    }
    async list(user, req) {
        const fleetId = user.fleetId ?? user.userId;
        return this.apiResponse.success({
            code: 'FLEET_VEHICLES_FETCHED',
            message: 'Fleet vehicles fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.listFleet(fleetId),
        });
    }
    async getById(user, vehicleId, req) {
        const fleetId = user.fleetId ?? user.userId;
        return this.apiResponse.success({
            code: 'FLEET_VEHICLE_FETCHED',
            message: 'Fleet vehicle fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.findFleetVehicleById(fleetId, vehicleId),
        });
    }
    async create(user, body, req) {
        const fleetId = user.fleetId ?? user.userId;
        return this.apiResponse.success({
            code: 'FLEET_VEHICLE_CREATED',
            message: 'Fleet vehicle created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.createFleet(fleetId, { ...body, status: body.status ?? 'inactive' }),
        });
    }
    async patch(user, vehicleId, body, req) {
        const fleetId = user.fleetId ?? user.userId;
        return this.apiResponse.success({
            code: 'FLEET_VEHICLE_UPDATED',
            message: 'Fleet vehicle updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.vehiclesService.updateFleet(fleetId, vehicleId, body),
        });
    }
};
exports.FleetVehiclesController = FleetVehiclesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetVehiclesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':vehicleId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('vehicleId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetVehiclesController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vehicle_dto_1.CreateVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], FleetVehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':vehicleId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('vehicleId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vehicle_dto_1.UpdateVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], FleetVehiclesController.prototype, "patch", null);
exports.FleetVehiclesController = FleetVehiclesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('fleet_owner', 'fleet_manager', 'fleet_dispatcher', 'fleet_finance'),
    (0, common_1.Controller)('fleet/vehicles'),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService,
        api_response_service_1.ApiResponseService])
], FleetVehiclesController);
//# sourceMappingURL=fleet-vehicles.controller.js.map