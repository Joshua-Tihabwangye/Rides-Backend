"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseService = void 0;
const common_1 = require("@nestjs/common");
let ApiResponseService = class ApiResponseService {
    success(input) {
        return {
            code: input.code ?? 'OK',
            message: input.message ?? 'Success',
            requestId: input.requestId,
            data: input.data,
        };
    }
    error(input) {
        return {
            code: input.code,
            message: input.message,
            requestId: input.requestId,
            details: input.details,
        };
    }
};
exports.ApiResponseService = ApiResponseService;
exports.ApiResponseService = ApiResponseService = __decorate([
    (0, common_1.Injectable)()
], ApiResponseService);
//# sourceMappingURL=api-response.service.js.map