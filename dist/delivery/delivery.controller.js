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
exports.DeliveryController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const driver_documents_guard_1 = require("../common/auth/driver-documents.guard");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const delivery_dto_1 = require("./dto/delivery.dto");
const delivery_service_1 = require("./delivery.service");
let DeliveryController = class DeliveryController {
    constructor(deliveryService, apiResponse) {
        this.deliveryService = deliveryService;
        this.apiResponse = apiResponse;
    }
    async listOrders(user, req) {
        return this.apiResponse.success({
            code: 'DELIVERY_ORDERS_FETCHED',
            message: 'Delivery orders fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.deliveryService.listOrders(user.driverId),
        });
    }
    async acceptOrder(user, orderId, req) {
        return this.apiResponse.success({
            code: 'DELIVERY_ORDER_ACCEPTED',
            message: 'Delivery order accepted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.deliveryService.acceptOrder(user.driverId, orderId),
        });
    }
    async getRoute(user, routeId, req) {
        return this.apiResponse.success({
            code: 'DELIVERY_ROUTE_FETCHED',
            message: 'Delivery route fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.deliveryService.getRoute(user.driverId, routeId),
        });
    }
    async pickupConfirm(user, routeId, req) {
        return this.apiResponse.success({
            code: 'DELIVERY_PICKUP_CONFIRMED',
            message: 'Delivery pickup confirmed',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.deliveryService.pickupConfirm(user.driverId, routeId),
        });
    }
    async qrVerify(user, routeId, body, req) {
        return this.apiResponse.success({
            code: 'DELIVERY_QR_VERIFIED',
            message: 'Delivery QR verified',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.deliveryService.qrVerify(user.driverId, routeId, body.qrValue),
        });
    }
    async startRoute(user, routeId, req) {
        return this.apiResponse.success({
            code: 'DELIVERY_ROUTE_STARTED',
            message: 'Delivery route started',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.deliveryService.startRoute(user.driverId, routeId),
        });
    }
    async completeStop(user, routeId, stopId, req) {
        return this.apiResponse.success({
            code: 'DELIVERY_STOP_COMPLETED',
            message: 'Delivery stop completed',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.deliveryService.completeStop(user.driverId, routeId, stopId),
        });
    }
    async dropoffComplete(user, routeId, req) {
        return this.apiResponse.success({
            code: 'DELIVERY_DROPOFF_COMPLETED',
            message: 'Delivery dropoff completed',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.deliveryService.dropoffComplete(user.driverId, routeId),
        });
    }
};
exports.DeliveryController = DeliveryController;
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "listOrders", null);
__decorate([
    (0, common_1.Post)('orders/:orderId/accept'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "acceptOrder", null);
__decorate([
    (0, common_1.Get)('routes/:routeId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('routeId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getRoute", null);
__decorate([
    (0, common_1.Post)('routes/:routeId/pickup-confirm'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('routeId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "pickupConfirm", null);
__decorate([
    (0, common_1.Post)('routes/:routeId/qr-verify'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('routeId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, delivery_dto_1.VerifyDeliveryQrDto, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "qrVerify", null);
__decorate([
    (0, common_1.Post)('routes/:routeId/start'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('routeId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "startRoute", null);
__decorate([
    (0, common_1.Post)('routes/:routeId/stops/:stopId/complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('routeId')),
    __param(2, (0, common_1.Param)('stopId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "completeStop", null);
__decorate([
    (0, common_1.Post)('routes/:routeId/dropoff-complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('routeId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "dropoffComplete", null);
exports.DeliveryController = DeliveryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, driver_documents_guard_1.DriverDocumentsGuard),
    (0, roles_decorator_1.Roles)('driver'),
    (0, common_1.Controller)('drivers/me/delivery'),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService,
        api_response_service_1.ApiResponseService])
], DeliveryController);
//# sourceMappingURL=delivery.controller.js.map