import type { DocumentExpiryStatus, DriverDocumentRecord } from "../types/document";
export declare function parseExpiryDate(expiryDate: string): Date | null;
export declare function validateFutureExpiryDate(expiryDate: string, now?: Date): {
    valid: boolean;
    error?: string;
};
export declare function getDaysUntilExpiry(expiryDate: Date, now?: Date): number;
export declare function getExpiryStatus(expiryDate: Date, warningDays?: number, now?: Date): DocumentExpiryStatus;
export declare function getNotificationWindows(daysUntilExpiry: number): number[];
export declare function buildExpiryEvents(documents: DriverDocumentRecord[], now?: Date): Array<{
    driverId: string;
    documentId: string;
    documentType: string;
    event: "expiring_soon" | "expired";
    daysUntilExpiry: number;
}>;
