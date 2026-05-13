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
exports.GeoController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const request_id_1 = require("../common/utils/request-id");
const location_dto_1 = require("./dto/location.dto");
const presence_location_service_1 = require("./presence-location.service");
const pricing_zone_service_1 = require("../pricing-zone/pricing-zone.service");
let GeoController = class GeoController {
    constructor(presenceLocationService, pricingZoneService, apiResponse) {
        this.presenceLocationService = presenceLocationService;
        this.pricingZoneService = pricingZoneService;
        this.apiResponse = apiResponse;
    }
    async nearbyDrivers(query, req) {
        return this.apiResponse.success({
            code: 'NEARBY_DRIVERS_FETCHED',
            message: 'Nearby drivers fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.presenceLocationService.findNearbyDrivers(query.lat, query.lng, query.radius),
        });
    }
    async getPricingZone(lat, lng, req) {
        const zone = await this.pricingZoneService.findZoneByLocation(lat, lng);
        return this.apiResponse.success({
            code: zone ? 'PRICING_ZONE_FOUND' : 'PRICING_ZONE_NOT_FOUND',
            message: zone ? 'Pricing zone found' : 'No pricing zone for location',
            requestId: (0, request_id_1.getRequestId)(req),
            data: zone,
        });
    }
};
exports.GeoController = GeoController;
__decorate([
    (0, common_1.Get)('nearby-drivers'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [location_dto_1.NearbyDriversQueryDto, Object]),
    __metadata("design:returntype", Promise)
], GeoController.prototype, "nearbyDrivers", null);
__decorate([
    (0, common_1.Get)('pricing-zone'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], GeoController.prototype, "getPricingZone", null);
exports.GeoController = GeoController = __decorate([
    (0, common_1.Controller)('geo'),
    __metadata("design:paramtypes", [presence_location_service_1.PresenceLocationService,
        pricing_zone_service_1.PricingZoneService,
        api_response_service_1.ApiResponseService])
], GeoController);
//# sourceMappingURL=geo.controller.js.map