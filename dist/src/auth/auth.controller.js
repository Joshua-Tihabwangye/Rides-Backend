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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const api_response_service_1 = require("../common/api/api-response.service");
let AuthController = class AuthController {
    constructor(authService, apiResponse) {
        this.authService = authService;
        this.apiResponse = apiResponse;
    }
    async register(body) {
        const result = await this.authService.register(body);
        return this.apiResponse.success({ code: 'REGISTER_SUCCESS', message: 'Registration successful', requestId: 'req-' + Date.now(), data: result });
    }
    async login(body) {
        const result = await this.authService.login(body.email, body.password);
        return this.apiResponse.success({ code: 'LOGIN_SUCCESS', message: 'Login successful', requestId: 'req-' + Date.now(), data: result });
    }
    async refresh(body) {
        const result = await this.authService.refresh(body.refreshToken);
        return this.apiResponse.success({ code: 'TOKEN_REFRESHED', message: 'Token refreshed', requestId: 'req-' + Date.now(), data: result });
    }
    async logout(body) {
        await this.authService.logout(body.refreshToken);
        return this.apiResponse.success({ code: 'LOGOUT_SUCCESS', message: 'Logged out successfully', requestId: 'req-' + Date.now(), data: null });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        api_response_service_1.ApiResponseService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map