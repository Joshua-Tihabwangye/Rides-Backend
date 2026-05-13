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
exports.FleetDriversController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const fleet_dto_1 = require("./dto/fleet.dto");
const fleet_service_1 = require("./fleet.service");
let FleetDriversController = class FleetDriversController {
    constructor(fleetService, apiResponse) {
        this.fleetService = fleetService;
        this.apiResponse = apiResponse;
    }
    async list(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_DRIVERS_FETCHED',
            message: 'Fleet drivers fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listDrivers(user.userId),
        });
    }
    async create(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_DRIVER_CREATED',
            message: 'Fleet driver created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.createDriver(user.userId, body),
        });
    }
    async patch(user, driverId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_DRIVER_UPDATED',
            message: 'Fleet driver updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.patchDriver(user.userId, driverId, body),
        });
    }
};
exports.FleetDriversController = FleetDriversController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetDriversController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.CreateFleetDriverDto, Object]),
    __metadata("design:returntype", Promise)
], FleetDriversController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':driverId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('driverId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, fleet_dto_1.UpdateFleetDriverDto, Object]),
    __metadata("design:returntype", Promise)
], FleetDriversController.prototype, "patch", null);
exports.FleetDriversController = FleetDriversController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('fleet_owner', 'fleet_manager', 'fleet_dispatcher'),
    (0, common_1.Controller)('fleet/drivers'),
    __metadata("design:paramtypes", [fleet_service_1.FleetService,
        api_response_service_1.ApiResponseService])
], FleetDriversController);
//# sourceMappingURL=fleet-drivers.controller.js.map