export interface NotificationService {
  sendDocumentExpiryNotice(input: {
    driverId: string;
    documentType: string;
    daysUntilExpiry: number;
    event: "expiring_soon" | "expired";
  }): Promise<void>;
}
