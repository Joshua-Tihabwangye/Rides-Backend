import { Router } from "express";
import type { DriverDocumentRepository } from "../repositories/documentRepository";
import {
  getDaysUntilExpiry,
  getExpiryStatus,
  parseExpiryDate,
  validateFutureExpiryDate,
} from "../services/documentExpiryService";
import type { UploadDriverDocumentInput } from "../types/document";

interface DocumentRoutesDeps {
  repository: DriverDocumentRepository;
  extractExpiryDateFromOcr?: (fileUrl: string) => Promise<string | null>;
}

export function createDocumentRoutes({ repository, extractExpiryDateFromOcr }: DocumentRoutesDeps) {
  const router = Router();

  router.post("/drivers/:driverId/documents", async (req, res, next) => {
    try {
      const driverId = req.params.driverId;
      const body = req.body as Partial<UploadDriverDocumentInput>;

      if (!body.documentType || !body.fileUrl) {
        return res.status(400).json({
          error: "documentType and fileUrl are required.",
        });
      }

      let expiryDateInput = (body.expiryDate || "").trim();

      // Optional OCR fallback if the client did not send expiryDate.
      if (!expiryDateInput && extractExpiryDateFromOcr) {
        const ocrDate = await extractExpiryDateFromOcr(body.fileUrl);
        if (ocrDate) {
          expiryDateInput = ocrDate;
        }
      }

      const validation = validateFutureExpiryDate(expiryDateInput);
      if (!validation.valid) {
        return res.status(422).json({
          error: validation.error,
        });
      }

      const parsedExpiryDate = parseExpiryDate(expiryDateInput);
      if (!parsedExpiryDate) {
        return res.status(422).json({
          error: "Invalid expiry date format. Use YYYY-MM-DD.",
        });
      }

      const saved = await repository.upsertDocument({
        driverId,
        documentType: body.documentType,
        fileUrl: body.fileUrl,
        expiryDate: parsedExpiryDate,
      });

      return res.status(201).json({
        id: saved.id,
        documentType: saved.documentType,
        fileUrl: saved.fileUrl,
        expiryDate: saved.expiryDate.toISOString().slice(0, 10),
        status: getExpiryStatus(saved.expiryDate),
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/drivers/:driverId/documents/status", async (req, res, next) => {
    try {
      const driverId = req.params.driverId;
      const documents = await repository.listRequiredDocumentsByDriver(driverId);
      return res.json({
        driverId,
        documents: documents.map((doc) => {
          const status = getExpiryStatus(doc.expiryDate);
          return {
            id: doc.id,
            documentType: doc.documentType,
            fileUrl: doc.fileUrl,
            expiryDate: doc.expiryDate.toISOString().slice(0, 10),
            expiryStatus: status,
            daysUntilExpiry: getDaysUntilExpiry(doc.expiryDate),
          };
        }),
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
