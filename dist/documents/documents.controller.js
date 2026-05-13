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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const request_id_1 = require("../common/utils/request-id");
const user_scope_1 = require("../common/utils/user-scope");
const document_dto_1 = require("./dto/document.dto");
const documents_service_1 = require("./documents.service");
let DocumentsController = class DocumentsController {
    constructor(documentsService, apiResponse) {
        this.documentsService = documentsService;
        this.apiResponse = apiResponse;
    }
    async postDocument(user, userTypeParam, body, req) {
        const userType = (0, user_scope_1.normalizeUserTypePath)(userTypeParam);
        (0, user_scope_1.assertUserScopeAccess)(user.roles, userType);
        return this.apiResponse.success({
            code: 'DOCUMENT_UPSERTED',
            message: 'Document uploaded',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.documentsService.upsertForUser(userType, user.userId, body),
        });
    }
    async listDocuments(user, userTypeParam, req) {
        const userType = (0, user_scope_1.normalizeUserTypePath)(userTypeParam);
        (0, user_scope_1.assertUserScopeAccess)(user.roles, userType);
        return this.apiResponse.success({
            code: 'DOCUMENTS_FETCHED',
            message: 'Documents fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.documentsService.listForUser(userType, user.userId),
        });
    }
    async getStatus(user, userTypeParam, req) {
        const userType = (0, user_scope_1.normalizeUserTypePath)(userTypeParam);
        (0, user_scope_1.assertUserScopeAccess)(user.roles, userType);
        return this.apiResponse.success({
            code: 'DOCUMENT_STATUS_FETCHED',
            message: 'Document status fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.documentsService.getDocumentsStatusForUser(userType, user.userId),
        });
    }
    async patchDocument(user, userTypeParam, documentId, body, req) {
        const userType = (0, user_scope_1.normalizeUserTypePath)(userTypeParam);
        (0, user_scope_1.assertUserScopeAccess)(user.roles, userType);
        return this.apiResponse.success({
            code: 'DOCUMENT_UPDATED',
            message: 'Document updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.documentsService.patchForUser(userType, user.userId, documentId, body),
        });
    }
    async resubmit(user, userTypeParam, documentId, body, req) {
        const userType = (0, user_scope_1.normalizeUserTypePath)(userTypeParam);
        (0, user_scope_1.assertUserScopeAccess)(user.roles, userType);
        return this.apiResponse.success({
            code: 'DOCUMENT_RESUBMITTED',
            message: 'Document resubmitted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.documentsService.resubmitForUser(userType, user.userId, documentId, body),
        });
    }
    async deleteDocument(user, userTypeParam, documentId, req) {
        const userType = (0, user_scope_1.normalizeUserTypePath)(userTypeParam);
        (0, user_scope_1.assertUserScopeAccess)(user.roles, userType);
        return this.apiResponse.success({
            code: 'DOCUMENT_DELETED',
            message: 'Document deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.documentsService.deleteForUser(userType, user.userId, documentId),
        });
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)(':userType/me/documents'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userType')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, document_dto_1.UpsertDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "postDocument", null);
__decorate([
    (0, common_1.Get)(':userType/me/documents'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userType')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "listDocuments", null);
__decorate([
    (0, common_1.Get)(':userType/me/documents/status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userType')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Patch)(':userType/me/documents/:documentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userType')),
    __param(2, (0, common_1.Param)('documentId')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, document_dto_1.PatchDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "patchDocument", null);
__decorate([
    (0, common_1.Post)(':userType/me/documents/:documentId/resubmit'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userType')),
    __param(2, (0, common_1.Param)('documentId')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, document_dto_1.PatchDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "resubmit", null);
__decorate([
    (0, common_1.Delete)(':userType/me/documents/:documentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userType')),
    __param(2, (0, common_1.Param)('documentId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "deleteDocument", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService,
        api_response_service_1.ApiResponseService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map