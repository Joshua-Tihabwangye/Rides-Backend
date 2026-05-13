import type {
  DocumentExpiryStatus,
  DriverDocumentRecord,
} from "../types/document";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseExpiryDate(expiryDate: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expiryDate.trim())) {
    return null;
  }
  const parsed = new Date(`${expiryDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

export function validateFutureExpiryDate(
  expiryDate: string,
  now: Date = new Date()
): { valid: boolean; error?: string } {
  const parsed = parseExpiryDate(expiryDate);
  if (!parsed) {
    return { valid: false, error: "Invalid expiry date format. Use YYYY-MM-DD." };
  }

  if (startOfDay(parsed).getTime() <= startOfDay(now).getTime()) {
    return { valid: false, error: "Expiry date must be in the future." };
  }

  return { valid: true };
}

export function getDaysUntilExpiry(expiryDate: Date, now: Date = new Date()): number {
  const expiryDay = startOfDay(expiryDate).getTime();
  const today = startOfDay(now).getTime();
  return Math.ceil((expiryDay - today) / DAY_MS);
}

export function getExpiryStatus(
  expiryDate: Date,
  warningDays = 30,
  now: Date = new Date()
): DocumentExpiryStatus {
  const days = getDaysUntilExpiry(expiryDate, now);
  if (days < 0) {
    return "expired";
  }
  if (days <= warningDays) {
    return "expiring_soon";
  }
  return "valid";
}

export function getNotificationWindows(daysUntilExpiry: number): number[] {
  const windows = [30, 14, 7];
  return windows.filter((windowDays) => windowDays === daysUntilExpiry);
}

export function buildExpiryEvents(
  documents: DriverDocumentRecord[],
  now: Date = new Date()
): Array<{
  driverId: string;
  documentId: string;
  documentType: string;
  event: "expiring_soon" | "expired";
  daysUntilExpiry: number;
}> {
  const events: Array<{
    driverId: string;
    documentId: string;
    documentType: string;
    event: "expiring_soon" | "expired";
    daysUntilExpiry: number;
  }> = [];

  for (const document of documents) {
    const days = getDaysUntilExpiry(document.expiryDate, now);
    if (days < 0) {
      events.push({
        driverId: document.driverId,
        documentId: document.id,
        documentType: document.documentType,
        event: "expired",
        daysUntilExpiry: days,
      });
      continue;
    }

    if (getNotificationWindows(days).length > 0) {
      events.push({
        driverId: document.driverId,
        documentId: document.id,
        documentType: document.documentType,
        event: "expiring_soon",
        daysUntilExpiry: days,
      });
    }
  }

  return events;
}
