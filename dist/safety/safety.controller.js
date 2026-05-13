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
exports.SafetyController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const safety_dto_1 = require("./dto/safety.dto");
const safety_service_1 = require("./safety.service");
let SafetyController = class SafetyController {
    constructor(safetyService, apiResponse) {
        this.safetyService = safetyService;
        this.apiResponse = apiResponse;
    }
    async getSafetyState(user, tripId, req) {
        return this.apiResponse.success({
            code: 'SAFETY_STATE_FETCHED',
            message: 'Safety state fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.getTripSafetyState(user.driverId, tripId),
        });
    }
    async saveSafetyState(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'SAFETY_STATE_UPDATED',
            message: 'Safety state updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.saveTripSafetyState(user.driverId, tripId, body),
        });
    }
    async temporaryStopRequest(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'SAFETY_TEMP_STOP_REQUESTED',
            message: 'Temporary stop requested',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.requestTemporaryStop(user.driverId, tripId, body.note),
        });
    }
    async temporaryStopRequestCompat(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'SAFETY_TEMP_STOP_REQUESTED',
            message: 'Temporary stop requested',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.requestTemporaryStop(user.driverId, tripId, body.note),
        });
    }
    async temporaryStopRespond(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'SAFETY_TEMP_STOP_RESPONDED',
            message: 'Temporary stop response recorded',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.respondTemporaryStop(user.driverId, tripId, body.decision),
        });
    }
    async temporaryStopRespondCompat(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'SAFETY_TEMP_STOP_RESPONDED',
            message: 'Temporary stop response recorded',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.respondTemporaryStop(user.driverId, tripId, body.decision),
        });
    }
    async temporaryStopResume(user, tripId, req) {
        return this.apiResponse.success({
            code: 'SAFETY_TEMP_STOP_RESUMED',
            message: 'Temporary stop resumed',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.resumeTemporaryStop(user.driverId, tripId),
        });
    }
    async temporaryStopResumeCompat(user, tripId, req) {
        return this.apiResponse.success({
            code: 'SAFETY_TEMP_STOP_RESUMED',
            message: 'Temporary stop resumed',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.resumeTemporaryStop(user.driverId, tripId),
        });
    }
    async safetyCheckRespond(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'SAFETY_CHECK_RESPONDED',
            message: 'Safety check response recorded',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.respondSafetyCheck(user.driverId, tripId, body.actor, body.action),
        });
    }
    async sos(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'SAFETY_SOS_TRIGGERED',
            message: 'SOS triggered',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.triggerSos(user.driverId, tripId, body),
        });
    }
    async sosCompat(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'SAFETY_SOS_TRIGGERED',
            message: 'SOS triggered',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.triggerSos(user.driverId, tripId, body),
        });
    }
    async listEmergencyContacts(user, req) {
        return this.apiResponse.success({
            code: 'EMERGENCY_CONTACTS_FETCHED',
            message: 'Emergency contacts fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.listEmergencyContacts(user.driverId),
        });
    }
    async createEmergencyContact(user, body, req) {
        return this.apiResponse.success({
            code: 'EMERGENCY_CONTACT_CREATED',
            message: 'Emergency contact created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.createEmergencyContact(user.driverId, body),
        });
    }
    async patchEmergencyContact(user, contactId, body, req) {
        return this.apiResponse.success({
            code: 'EMERGENCY_CONTACT_UPDATED',
            message: 'Emergency contact updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.patchEmergencyContact(user.driverId, contactId, body),
        });
    }
    async deleteEmergencyContact(user, contactId, req) {
        return this.apiResponse.success({
            code: 'EMERGENCY_CONTACT_DELETED',
            message: 'Emergency contact deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.safetyService.deleteEmergencyContact(user.driverId, contactId),
        });
    }
};
exports.SafetyController = SafetyController;
__decorate([
    (0, common_1.Get)('trips/:tripId/safety'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "getSafetyState", null);
__decorate([
    (0, common_1.Put)('trips/:tripId/safety'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "saveSafetyState", null);
__decorate([
    (0, common_1.Post)('trips/:tripId/temporary-stop/request'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, safety_dto_1.TemporaryStopRequestDto, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "temporaryStopRequest", null);
__decorate([
    (0, common_1.Post)('trips/:tripId/safety/temporary-stop/request'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, safety_dto_1.TemporaryStopRequestDto, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "temporaryStopRequestCompat", null);
__decorate([
    (0, common_1.Post)('trips/:tripId/temporary-stop/respond'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, safety_dto_1.TemporaryStopRespondDto, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "temporaryStopRespond", null);
__decorate([
    (0, common_1.Post)('trips/:tripId/safety/temporary-stop/respond'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, safety_dto_1.TemporaryStopRespondDto, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "temporaryStopRespondCompat", null);
__decorate([
    (0, common_1.Post)('trips/:tripId/temporary-stop/resume'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "temporaryStopResume", null);
__decorate([
    (0, common_1.Post)('trips/:tripId/safety/temporary-stop/resume'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "temporaryStopResumeCompat", null);
__decorate([
    (0, common_1.Post)('trips/:tripId/safety-check/respond'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, safety_dto_1.SafetyCheckRespondDto, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "safetyCheckRespond", null);
__decorate([
    (0, common_1.Post)('trips/:tripId/sos'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, safety_dto_1.SosDto, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "sos", null);
__decorate([
    (0, common_1.Post)('trips/:tripId/safety/sos'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, safety_dto_1.SosDto, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "sosCompat", null);
__decorate([
    (0, common_1.Get)('emergency-contacts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "listEmergencyContacts", null);
__decorate([
    (0, common_1.Post)('emergency-contacts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, safety_dto_1.EmergencyContactDto, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "createEmergencyContact", null);
__decorate([
    (0, common_1.Patch)('emergency-contacts/:contactId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('contactId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, safety_dto_1.EmergencyContactDto, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "patchEmergencyContact", null);
__decorate([
    (0, common_1.Delete)('emergency-contacts/:contactId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('contactId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "deleteEmergencyContact", null);
exports.SafetyController = SafetyController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('driver'),
    (0, common_1.Controller)('drivers/me'),
    __metadata("design:paramtypes", [safety_service_1.SafetyService,
        api_response_service_1.ApiResponseService])
], SafetyController);
//# sourceMappingURL=safety.controller.js.map