import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly apiResponse;
    constructor(notificationsService: NotificationsService, apiResponse: ApiResponseService);
    list(user: AuthenticatedUser, userTypeParam: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/notification.entity").Notification[]>>;
    markRead(user: AuthenticatedUser, userTypeParam: string, notificationId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/notification.entity").Notification>>;
    markAllRead(user: AuthenticatedUser, userTypeParam: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        updated: number;
    }>>;
}
