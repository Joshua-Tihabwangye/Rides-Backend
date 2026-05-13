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
exports.AdminPricingZoneController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const pricing_zone_service_1 = require("../pricing-zone/pricing-zone.service");
const admin_dto_1 = require("../admin/dto/admin.dto");
let AdminPricingZoneController = class AdminPricingZoneController {
    constructor(pricingZoneService, apiResponse) {
        this.pricingZoneService = pricingZoneService;
        this.apiResponse = apiResponse;
    }
    async listZones(req) {
        return this.apiResponse.success({
            code: 'PRICING_ZONES_FETCHED',
            message: 'Pricing zones fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.pricingZoneService.listZones(),
        });
    }
    async getZone(zoneId, req) {
        return this.apiResponse.success({
            code: 'PRICING_ZONE_FETCHED',
            message: 'Pricing zone fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.pricingZoneService.getZone(zoneId),
        });
    }
    async createZone(user, body, req) {
        const zone = await this.pricingZoneService.createZone({
            name: body.name,
            description: body.description,
            boundaries: body.boundaries,
            pricingRules: body.pricingRules,
            status: body.status,
        });
        return this.apiResponse.success({
            code: 'PRICING_ZONE_CREATED',
            message: 'Pricing zone created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: zone,
        });
    }
    async updateZone(user, zoneId, body, req) {
        const zone = await this.pricingZoneService.patchZone(zoneId, {
            name: body.name,
            description: body.description,
            boundaries: body.boundaries,
            pricingRules: body.pricingRules,
            status: body.status,
        });
        return this.apiResponse.success({
            code: 'PRICING_ZONE_UPDATED',
            message: 'Pricing zone updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: zone,
        });
    }
};
exports.AdminPricingZoneController = AdminPricingZoneController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminPricingZoneController.prototype, "listZones", null);
__decorate([
    (0, common_1.Get)(':zoneId'),
    __param(0, (0, common_1.Param)('zoneId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminPricingZoneController.prototype, "getZone", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreatePricingZoneDto, Object]),
    __metadata("design:returntype", Promise)
], AdminPricingZoneController.prototype, "createZone", null);
__decorate([
    (0, common_1.Patch)(':zoneId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('zoneId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdatePricingZoneDto, Object]),
    __metadata("design:returntype", Promise)
], AdminPricingZoneController.prototype, "updateZone", null);
exports.AdminPricingZoneController = AdminPricingZoneController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    (0, common_1.Controller)('admin/pricing-zones'),
    __metadata("design:paramtypes", [pricing_zone_service_1.PricingZoneService,
        api_response_service_1.ApiResponseService])
], AdminPricingZoneController);
//# sourceMappingURL=admin-pricing-zone.controller.js.map