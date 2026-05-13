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
exports.AdminConfigController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const admin_dto_1 = require("./dto/admin.dto");
const admin_service_1 = require("./admin.service");
let AdminConfigController = class AdminConfigController {
    constructor(adminService, apiResponse) {
        this.adminService = adminService;
        this.apiResponse = apiResponse;
    }
    async listPricing(req) {
        return this.apiResponse.success({
            code: 'ADMIN_PRICING_FETCHED',
            message: 'Pricing configs fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listPricing(),
        });
    }
    async getPricing(pricingId, req) {
        return this.apiResponse.success({
            code: 'ADMIN_PRICING_FETCHED',
            message: 'Pricing config fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getPricing(pricingId),
        });
    }
    async createPricing(user, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_PRICING_CREATED',
            message: 'Pricing config created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.createPricing(user.userId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async patchPricing(user, pricingId, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_PRICING_UPDATED',
            message: 'Pricing config updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.patchPricing(user.userId, pricingId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async listPromos(req) {
        return this.apiResponse.success({
            code: 'ADMIN_PROMOS_FETCHED',
            message: 'Promos fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listPromos(),
        });
    }
    async getPromo(promoId, req) {
        return this.apiResponse.success({
            code: 'ADMIN_PROMO_FETCHED',
            message: 'Promo fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getPromo(promoId),
        });
    }
    async createPromo(user, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_PROMO_CREATED',
            message: 'Promo created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.createPromo(user.userId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async patchPromo(user, promoId, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_PROMO_UPDATED',
            message: 'Promo updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.patchPromo(user.userId, promoId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async listServices(req) {
        return this.apiResponse.success({
            code: 'ADMIN_SERVICES_FETCHED',
            message: 'Service configs fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.listServices(),
        });
    }
    async getService(serviceId, req) {
        return this.apiResponse.success({
            code: 'ADMIN_SERVICE_FETCHED',
            message: 'Service config fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.getService(serviceId),
        });
    }
    async createServiceConfig(user, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_SERVICE_CREATED',
            message: 'Service config created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.createServiceConfig(user.userId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
    async patchServiceConfig(user, serviceId, body, req) {
        return this.apiResponse.success({
            code: 'ADMIN_SERVICE_UPDATED',
            message: 'Service config updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.adminService.patchServiceConfig(user.userId, serviceId, body, { ipAddress: req.ip, userAgent: req.headers['user-agent'] }),
        });
    }
};
exports.AdminConfigController = AdminConfigController;
__decorate([
    (0, common_1.Get)('pricing'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "listPricing", null);
__decorate([
    (0, common_1.Get)('pricing/:pricingId'),
    __param(0, (0, common_1.Param)('pricingId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "getPricing", null);
__decorate([
    (0, common_1.Post)('pricing'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreatePricingConfigDto, Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "createPricing", null);
__decorate([
    (0, common_1.Patch)('pricing/:pricingId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('pricingId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdatePricingConfigDto, Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "patchPricing", null);
__decorate([
    (0, common_1.Get)('promos'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "listPromos", null);
__decorate([
    (0, common_1.Get)('promos/:promoId'),
    __param(0, (0, common_1.Param)('promoId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "getPromo", null);
__decorate([
    (0, common_1.Post)('promos'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreatePromoDto, Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "createPromo", null);
__decorate([
    (0, common_1.Patch)('promos/:promoId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('promoId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdatePromoDto, Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "patchPromo", null);
__decorate([
    (0, common_1.Get)('services'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "listServices", null);
__decorate([
    (0, common_1.Get)('services/:serviceId'),
    __param(0, (0, common_1.Param)('serviceId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "getService", null);
__decorate([
    (0, common_1.Post)('services'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreateServiceConfigDto, Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "createServiceConfig", null);
__decorate([
    (0, common_1.Patch)('services/:serviceId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_dto_1.UpdateServiceConfigDto, Object]),
    __metadata("design:returntype", Promise)
], AdminConfigController.prototype, "patchServiceConfig", null);
exports.AdminConfigController = AdminConfigController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        api_response_service_1.ApiResponseService])
], AdminConfigController);
//# sourceMappingURL=admin-config.controller.js.map