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
exports.EarningsCashoutController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const earnings_dto_1 = require("./dto/earnings.dto");
const earnings_cashout_service_1 = require("./earnings-cashout.service");
let EarningsCashoutController = class EarningsCashoutController {
    constructor(earningsService, apiResponse) {
        this.earningsService = earningsService;
        this.apiResponse = apiResponse;
    }
    async getSummary(user, query, req) {
        return this.apiResponse.success({
            code: 'EARNINGS_SUMMARY_FETCHED',
            message: 'Earnings summary fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.earningsService.getSummary(user.driverId, query.period),
        });
    }
    async getEvents(user, req) {
        return this.apiResponse.success({
            code: 'EARNINGS_EVENTS_FETCHED',
            message: 'Earnings events fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.earningsService.getEvents(user.driverId),
        });
    }
    async getWalletEventsCompat(user, req) {
        return this.apiResponse.success({
            code: 'EARNINGS_EVENTS_FETCHED',
            message: 'Wallet events fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.earningsService.getEvents(user.driverId),
        });
    }
    async getWallet(user, req) {
        return this.apiResponse.success({
            code: 'WALLET_FETCHED',
            message: 'Wallet fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.earningsService.getWallet(user.driverId),
        });
    }
    getCashoutMethods(user, req) {
        return this.apiResponse.success({
            code: 'CASHOUT_METHODS_FETCHED',
            message: 'Cashout methods fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: this.earningsService.getCashoutMethods(user.driverId),
        });
    }
    async postCashoutRequest(user, body, req) {
        return this.apiResponse.success({
            code: 'CASHOUT_REQUEST_CREATED',
            message: 'Cashout request created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.earningsService.createCashoutRequest(user.driverId, body),
        });
    }
    async postWalletCashoutCompat(user, body, req) {
        return this.apiResponse.success({
            code: 'CASHOUT_REQUEST_CREATED',
            message: 'Cashout request created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.earningsService.createCashoutRequest(user.driverId, body),
        });
    }
    async listCashoutRequests(user, req) {
        return this.apiResponse.success({
            code: 'CASHOUT_REQUESTS_FETCHED',
            message: 'Cashout requests fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.earningsService.listCashoutRequests(user.driverId),
        });
    }
    async listWalletCashoutsCompat(user, req) {
        return this.apiResponse.success({
            code: 'CASHOUT_REQUESTS_FETCHED',
            message: 'Cashout requests fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.earningsService.listCashoutRequests(user.driverId),
        });
    }
};
exports.EarningsCashoutController = EarningsCashoutController;
__decorate([
    (0, common_1.Get)('earnings/summary'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earnings_dto_1.EarningsSummaryQueryDto, Object]),
    __metadata("design:returntype", Promise)
], EarningsCashoutController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('earnings/events'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EarningsCashoutController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)('wallet/events'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EarningsCashoutController.prototype, "getWalletEventsCompat", null);
__decorate([
    (0, common_1.Get)('wallet'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EarningsCashoutController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Get)('cashout/methods'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EarningsCashoutController.prototype, "getCashoutMethods", null);
__decorate([
    (0, common_1.Post)('cashout/requests'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earnings_dto_1.CashoutRequestDto, Object]),
    __metadata("design:returntype", Promise)
], EarningsCashoutController.prototype, "postCashoutRequest", null);
__decorate([
    (0, common_1.Post)('wallet/cashout'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earnings_dto_1.CashoutRequestDto, Object]),
    __metadata("design:returntype", Promise)
], EarningsCashoutController.prototype, "postWalletCashoutCompat", null);
__decorate([
    (0, common_1.Get)('cashout/requests'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EarningsCashoutController.prototype, "listCashoutRequests", null);
__decorate([
    (0, common_1.Get)('wallet/cashout'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EarningsCashoutController.prototype, "listWalletCashoutsCompat", null);
exports.EarningsCashoutController = EarningsCashoutController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('driver'),
    (0, common_1.Controller)('drivers/me'),
    __metadata("design:paramtypes", [earnings_cashout_service_1.EarningsCashoutService,
        api_response_service_1.ApiResponseService])
], EarningsCashoutController);
//# sourceMappingURL=earnings-cashout.controller.js.map