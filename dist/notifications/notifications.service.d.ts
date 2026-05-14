import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userType: string, userId: string): Promise<{
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
    }[]>;
    markRead(userType: string, userId: string, notificationId: string): Promise<{
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
    }>;
    markAllRead(userType: string, userId: string): Promise<{
        updated: number;
    }>;
}
