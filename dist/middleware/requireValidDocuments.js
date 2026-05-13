"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireValidDocuments = requireValidDocuments;
const documentExpiryService_1 = require("../services/documentExpiryService");
const REQUIRED_DOCUMENT_TYPES = [
    "national_id_or_passport",
    "drivers_license",
    "conduct_clearance",
    "vehicle_logbook",
    "vehicle_insurance",
    "vehicle_inspection",
];
const EXPIRED_DOCUMENTS_ERROR = "Your documents have expired. Please upload valid documents.";
function requireValidDocuments(repository) {
    return async function requireValidDocumentsMiddleware(req, res, next) {
        try {
            const rawDriverId = req.user?.driverId || req.params.driverId;
            const driverId = Array.isArray(rawDriverId) ? rawDriverId[0] : rawDriverId;
            if (!driverId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const documents = await repository.listRequiredDocumentsByDriver(driverId);
            const requiredDocuments = documents.filter((document) => REQUIRED_DOCUMENT_TYPES.includes(document.documentType));
            const hasExpiredDocument = requiredDocuments.some((document) => (0, documentExpiryService_1.getExpiryStatus)(document.expiryDate) === "expired");
            if (hasExpiredDocument) {
                return res.status(403).json({
                    code: "DOCUMENTS_EXPIRED",
                    error: EXPIRED_DOCUMENTS_ERROR,
                });
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
}
//# sourceMappingURL=requireValidDocuments.js.map