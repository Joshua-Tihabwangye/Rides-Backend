import type { DriverDocumentRepository } from "../repositories/documentRepository";
import type { NotificationService } from "../services/notificationService";
interface StartDocumentExpiryCronInput {
    repository: DriverDocumentRepository;
    notifications: NotificationService;
}
export declare function startDocumentExpiryCron({ repository, notifications, }: StartDocumentExpiryCronInput): import("node-cron").ScheduledTask;
export {};
