"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExpiryDate = parseExpiryDate;
exports.validateFutureExpiryDate = validateFutureExpiryDate;
exports.getDaysUntilExpiry = getDaysUntilExpiry;
exports.getExpiryStatus = getExpiryStatus;
exports.getNotificationWindows = getNotificationWindows;
exports.buildExpiryEvents = buildExpiryEvents;
const DAY_MS = 24 * 60 * 60 * 1000;
function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function parseExpiryDate(expiryDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expiryDate.trim())) {
        return null;
    }
    const parsed = new Date(`${expiryDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }
    return parsed;
}
function validateFutureExpiryDate(expiryDate, now = new Date()) {
    const parsed = parseExpiryDate(expiryDate);
    if (!parsed) {
        return { valid: false, error: "Invalid expiry date format. Use YYYY-MM-DD." };
    }
    if (startOfDay(parsed).getTime() <= startOfDay(now).getTime()) {
        return { valid: false, error: "Expiry date must be in the future." };
    }
    return { valid: true };
}
function getDaysUntilExpiry(expiryDate, now = new Date()) {
    const expiryDay = startOfDay(expiryDate).getTime();
    const today = startOfDay(now).getTime();
    return Math.ceil((expiryDay - today) / DAY_MS);
}
function getExpiryStatus(expiryDate, warningDays = 30, now = new Date()) {
    const days = getDaysUntilExpiry(expiryDate, now);
    if (days < 0) {
        return "expired";
    }
    if (days <= warningDays) {
        return "expiring_soon";
    }
    return "valid";
}
function getNotificationWindows(daysUntilExpiry) {
    const windows = [30, 14, 7];
    return windows.filter((windowDays) => windowDays === daysUntilExpiry);
}
function buildExpiryEvents(documents, now = new Date()) {
    const events = [];
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
//# sourceMappingURL=documentExpiryService.js.map