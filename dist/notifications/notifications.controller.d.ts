import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly apiResponse;
    constructor(notificationsService: NotificationsService, apiResponse: ApiResponseService);
    list(user: AuthenticatedUser, userTypeParam: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
        title: string;
        userType: string;
        body: string;
        read: boolean;
        isRead: boolean;
        readAt: Date | null;
    }[]>>;
    markRead(user: AuthenticatedUser, userTypeParam: string, notificationId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
        title: string;
        userType: string;
        body: string;
        read: boolean;
        isRead: boolean;
        readAt: Date | null;
    }>>;
    markAllRead(user: AuthenticatedUser, userTypeParam: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        updated: number;
    }>>;
}
