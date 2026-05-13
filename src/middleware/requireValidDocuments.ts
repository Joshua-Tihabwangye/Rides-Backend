import type { NextFunction, Request, Response } from "express";
import type { DriverDocumentRepository } from "../repositories/documentRepository";
import { getExpiryStatus } from "../services/documentExpiryService";
import type { DriverDocumentType } from "../types/document";

const REQUIRED_DOCUMENT_TYPES: readonly DriverDocumentType[] = [
  "national_id_or_passport",
  "drivers_license",
  "conduct_clearance",
  "vehicle_logbook",
  "vehicle_insurance",
  "vehicle_inspection",
];

const EXPIRED_DOCUMENTS_ERROR = "Your documents have expired. Please upload valid documents.";

export function requireValidDocuments(repository: DriverDocumentRepository) {
  return async function requireValidDocumentsMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const rawDriverId =
        (req as Request & { user?: { driverId?: string } }).user?.driverId || req.params.driverId;
      const driverId = Array.isArray(rawDriverId) ? rawDriverId[0] : rawDriverId;

      if (!driverId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const documents = await repository.listRequiredDocumentsByDriver(driverId);
      const requiredDocuments = documents.filter((document) =>
        REQUIRED_DOCUMENT_TYPES.includes(document.documentType)
      );
      const hasExpiredDocument = requiredDocuments.some(
        (document) => getExpiryStatus(document.expiryDate) === "expired"
      );

      if (hasExpiredDocument) {
        return res.status(403).json({
          code: "DOCUMENTS_EXPIRED",
          error: EXPIRED_DOCUMENTS_ERROR,
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
