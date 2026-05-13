import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
export declare class NotificationsService {
    private notificationRepo;
    constructor(notificationRepo: Repository<Notification>);
    list(userType: string, userId: string): Promise<Notification[]>;
    markRead(userType: string, userId: string, notificationId: string): Promise<Notification>;
    markAllRead(userType: string, userId: string): Promise<{
        updated: number;
    }>;
}
