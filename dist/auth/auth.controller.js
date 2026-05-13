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
const auth_dto_1 = require("./dto/auth.dto");
const request_id_1 = require("../common/utils/request-id");
let AuthController = class AuthController {
    constructor(authService, apiResponse) {
        this.authService = authService;
        this.apiResponse = apiResponse;
    }
    async register(body, req) {
        const result = await this.authService.register(body);
        return this.apiResponse.success({ code: 'REGISTER_SUCCESS', message: 'Registration successful', requestId: (0, request_id_1.getRequestId)(req), data: result });
    }
    async login(body, req) {
        const result = await this.authService.login(body.email, body.password);
        return this.apiResponse.success({ code: 'LOGIN_SUCCESS', message: 'Login successful', requestId: (0, request_id_1.getRequestId)(req), data: result });
    }
    async refresh(body, req) {
        const result = await this.authService.refresh(body.refreshToken);
        return this.apiResponse.success({ code: 'TOKEN_REFRESHED', message: 'Token refreshed', requestId: (0, request_id_1.getRequestId)(req), data: result });
    }
    async logout(body, req) {
        await this.authService.logout(body.refreshToken);
        return this.apiResponse.success({ code: 'LOGOUT_SUCCESS', message: 'Logged out successfully', requestId: (0, request_id_1.getRequestId)(req), data: null });
    }
    async forgotPassword(dto, req) {
        const result = await this.authService.requestPasswordReset(dto.email);
        return this.apiResponse.success({
            code: 'PASSWORD_RESET_INITIATED',
            message: result.sent ? 'Password reset OTP sent' : 'Failed to send OTP',
            requestId: (0, request_id_1.getRequestId)(req),
            data: result,
        });
    }
    async verifyOtp(dto, req) {
        const result = await this.authService.verifyOtp(dto.email, dto.otp);
        return this.apiResponse.success({ code: 'OTP_VERIFIED', message: 'OTP verified', requestId: (0, request_id_1.getRequestId)(req), data: result });
    }
    async resetPassword(dto, req) {
        const result = await this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
        return this.apiResponse.success({ code: 'PASSWORD_RESET_COMPLETE', message: 'Password reset successful', requestId: (0, request_id_1.getRequestId)(req), data: result });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LogoutDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ForgotPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.VerifyOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        api_response_service_1.ApiResponseService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map