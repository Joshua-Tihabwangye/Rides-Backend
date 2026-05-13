"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDocumentExpiryCron = startDocumentExpiryCron;
const node_cron_1 = require("node-cron");
const documentExpiryService_1 = require("../services/documentExpiryService");
function startDocumentExpiryCron({ repository, notifications, }) {
    return node_cron_1.default.schedule("0 7 * * *", async () => {
        const documents = await repository.listDocumentsExpiringWithin(30);
        const events = (0, documentExpiryService_1.buildExpiryEvents)(documents);
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
//# sourceMappingURL=documentExpiryCron.js.map