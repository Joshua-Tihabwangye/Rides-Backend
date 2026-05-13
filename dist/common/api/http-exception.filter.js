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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("./api-response.service");
const request_id_1 = require("../utils/request-id");
let HttpExceptionFilter = class HttpExceptionFilter {
    constructor(apiResponse) {
        this.apiResponse = apiResponse;
    }
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const requestId = (0, request_id_1.getRequestId)(request);
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const payload = exception.getResponse();
            const details = typeof payload === 'string' ? undefined : payload;
            const message = typeof payload === 'string' ? payload : exception.message;
            response.status(status).json(this.apiResponse.error({
                code: this.codeFromStatus(status),
                message,
                details,
                requestId,
            }));
            return;
        }
        response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json(this.apiResponse.error({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Unexpected server error',
            requestId,
        }));
    }
    codeFromStatus(status) {
        if (status >= 500) {
            return 'INTERNAL_SERVER_ERROR';
        }
        if (status === 401) {
            return 'UNAUTHORIZED';
        }
        if (status === 403) {
            return 'FORBIDDEN';
        }
        if (status === 404) {
            return 'NOT_FOUND';
        }
        if (status === 400) {
            return 'BAD_REQUEST';
        }
        if (status === 422) {
            return 'VALIDATION_ERROR';
        }
        return 'REQUEST_FAILED';
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [api_response_service_1.ApiResponseService])
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map