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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const request_id_1 = require("../common/utils/request-id");
const user_scope_1 = require("../common/utils/user-scope");
const notifications_service_1 = require("./notifications.service");
let NotificationsController = class NotificationsController {
    constructor(notificationsService, apiResponse) {
        this.notificationsService = notificationsService;
        this.apiResponse = apiResponse;
    }
    async list(user, userTypeParam, req) {
        const userType = (0, user_scope_1.normalizeUserTypePath)(userTypeParam);
        (0, user_scope_1.assertUserScopeAccess)(user.roles, userType);
        return this.apiResponse.success({
            code: 'NOTIFICATIONS_FETCHED',
            message: 'Notifications fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.notificationsService.list(userType, user.userId),
        });
    }
    async markRead(user, userTypeParam, notificationId, req) {
        const userType = (0, user_scope_1.normalizeUserTypePath)(userTypeParam);
        (0, user_scope_1.assertUserScopeAccess)(user.roles, userType);
        return this.apiResponse.success({
            code: 'NOTIFICATION_READ',
            message: 'Notification marked as read',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.notificationsService.markRead(userType, user.userId, notificationId),
        });
    }
    async markAllRead(user, userTypeParam, req) {
        const userType = (0, user_scope_1.normalizeUserTypePath)(userTypeParam);
        (0, user_scope_1.assertUserScopeAccess)(user.roles, userType);
        return this.apiResponse.success({
            code: 'NOTIFICATIONS_READ_ALL',
            message: 'All notifications marked as read',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.notificationsService.markAllRead(userType, user.userId),
        });
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(':userType/me/notifications'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userType')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)(':userType/me/notifications/:notificationId/read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userType')),
    __param(2, (0, common_1.Param)('notificationId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markRead", null);
__decorate([
    (0, common_1.Patch)(':userType/me/notifications/read-all'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userType')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllRead", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        api_response_service_1.ApiResponseService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map