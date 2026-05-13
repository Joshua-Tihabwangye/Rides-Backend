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
exports.OnboardingController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const onboarding_service_1 = require("./onboarding.service");
let OnboardingController = class OnboardingController {
    constructor(onboardingService, apiResponse) {
        this.onboardingService = onboardingService;
        this.apiResponse = apiResponse;
    }
    getCheckpoints(user, req) {
        const driverId = user.driverId ?? user.userId;
        return this.apiResponse.success({
            code: 'DRIVER_ONBOARDING_CHECKPOINTS_FETCHED',
            message: 'Onboarding checkpoints fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: this.onboardingService.getCheckpoints(driverId),
        });
    }
};
exports.OnboardingController = OnboardingController;
__decorate([
    (0, common_1.Get)('checkpoints'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "getCheckpoints", null);
exports.OnboardingController = OnboardingController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('driver'),
    (0, common_1.Controller)('drivers/me/onboarding'),
    __metadata("design:paramtypes", [onboarding_service_1.OnboardingService,
        api_response_service_1.ApiResponseService])
], OnboardingController);
//# sourceMappingURL=onboarding.controller.js.map