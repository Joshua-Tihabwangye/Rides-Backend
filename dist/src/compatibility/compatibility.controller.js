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
exports.CompatibilityContractController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const request_id_1 = require("../common/utils/request-id");
const compat_auth_dto_1 = require("./dto/compat-auth.dto");
const compatibility_service_1 = require("./compatibility.service");
let CompatibilityContractController = class CompatibilityContractController {
    constructor(compatibilityService, apiResponse) {
        this.compatibilityService = compatibilityService;
        this.apiResponse = apiResponse;
    }
    getContracts(req) {
        return this.apiResponse.success({
            code: 'COMPAT_CONTRACTS_FETCHED',
            message: 'Compatibility contracts fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: this.compatibilityService.getContracts(),
        });
    }
    getContract(appId, req) {
        return this.apiResponse.success({
            code: 'COMPAT_CONTRACT_FETCHED',
            message: 'Compatibility contract fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: this.compatibilityService.getContract(appId),
        });
    }
    getBootstrap(appId, req) {
        return this.apiResponse.success({
            code: 'COMPAT_BOOTSTRAP_FETCHED',
            message: 'Compatibility bootstrap fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: this.compatibilityService.getBootstrap(appId),
        });
    }
    async getRuntimeFlags(appId, req) {
        return this.apiResponse.success({
            code: 'COMPAT_FLAGS_FETCHED',
            message: 'Compatibility runtime flags fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.compatibilityService.getRuntimeFlags(appId),
        });
    }
    compatSignIn(appId, body, req) {
        return this.apiResponse.success({
            code: 'COMPAT_SIGN_IN_OK',
            message: 'Compatibility sign-in payload generated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: this.compatibilityService.signInCompat(appId, body),
        });
    }
};
exports.CompatibilityContractController = CompatibilityContractController;
__decorate([
    (0, common_1.Get)('contracts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompatibilityContractController.prototype, "getContracts", null);
__decorate([
    (0, common_1.Get)('contracts/:appId'),
    __param(0, (0, common_1.Param)('appId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CompatibilityContractController.prototype, "getContract", null);
__decorate([
    (0, common_1.Get)('bootstrap/:appId'),
    __param(0, (0, common_1.Param)('appId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CompatibilityContractController.prototype, "getBootstrap", null);
__decorate([
    (0, common_1.Get)('flags/:appId'),
    __param(0, (0, common_1.Param)('appId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompatibilityContractController.prototype, "getRuntimeFlags", null);
__decorate([
    (0, common_1.Post)(':appId/auth/sign-in'),
    __param(0, (0, common_1.Param)('appId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, compat_auth_dto_1.CompatSignInDto, Object]),
    __metadata("design:returntype", void 0)
], CompatibilityContractController.prototype, "compatSignIn", null);
exports.CompatibilityContractController = CompatibilityContractController = __decorate([
    (0, common_1.Controller)('compat'),
    __metadata("design:paramtypes", [compatibility_service_1.CompatibilityContractService,
        api_response_service_1.ApiResponseService])
], CompatibilityContractController);
//# sourceMappingURL=compatibility.controller.js.map