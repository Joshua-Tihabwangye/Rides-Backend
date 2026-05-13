import cron from "node-cron";
import type { DriverDocumentRepository } from "../repositories/documentRepository";
import { buildExpiryEvents } from "../services/documentExpiryService";
import type { NotificationService } from "../services/notificationService";

interface StartDocumentExpiryCronInput {
  repository: DriverDocumentRepository;
  notifications: NotificationService;
}

export function startDocumentExpiryCron({
  repository,
  notifications,
}: StartDocumentExpiryCronInput) {
  // Runs every day at 07:00 server time.
  return cron.schedule("0 7 * * *", async () => {
    const documents = await repository.listDocumentsExpiringWithin(30);
    const events = buildExpiryEvents(documents);

    for (const event of events) {
      await notifications.sendDocumentExpiryNotice({
        driverId: event.driverId,
        documentType: event.documentType,
        daysUntilExpiry: event.daysUntilExpiry,
        event: event.event,
      });
    }
  });
}
