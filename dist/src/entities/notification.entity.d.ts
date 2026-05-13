export declare class Notification {
    id: string;
    userId: string;
    userType: string;
    title: string;
    body: string;
    type: string;
    data: Record<string, any>;
    read: boolean;
    isRead: boolean;
    readAt: Date;
    createdAt: Date;
}
