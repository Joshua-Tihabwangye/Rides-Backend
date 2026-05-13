"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentRoutes = createDocumentRoutes;
const express_1 = require("express");
const documentExpiryService_1 = require("../services/documentExpiryService");
function createDocumentRoutes({ repository, extractExpiryDateFromOcr }) {
    const router = (0, express_1.Router)();
    router.post("/drivers/:driverId/documents", async (req, res, next) => {
        try {
            const driverId = req.params.driverId;
            const body = req.body;
            if (!body.documentType || !body.fileUrl) {
                return res.status(400).json({
                    error: "documentType and fileUrl are required.",
                });
            }
            let expiryDateInput = (body.expiryDate || "").trim();
            if (!expiryDateInput && extractExpiryDateFromOcr) {
                const ocrDate = await extractExpiryDateFromOcr(body.fileUrl);
                if (ocrDate) {
                    expiryDateInput = ocrDate;
                }
            }
            const validation = (0, documentExpiryService_1.validateFutureExpiryDate)(expiryDateInput);
            if (!validation.valid) {
                return res.status(422).json({
                    error: validation.error,
                });
            }
            const parsedExpiryDate = (0, documentExpiryService_1.parseExpiryDate)(expiryDateInput);
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
                status: (0, documentExpiryService_1.getExpiryStatus)(saved.expiryDate),
            });
        }
        catch (error) {
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
                    const status = (0, documentExpiryService_1.getExpiryStatus)(doc.expiryDate);
                    return {
                        id: doc.id,
                        documentType: doc.documentType,
                        fileUrl: doc.fileUrl,
                        expiryDate: doc.expiryDate.toISOString().slice(0, 10),
                        expiryStatus: status,
                        daysUntilExpiry: (0, documentExpiryService_1.getDaysUntilExpiry)(doc.expiryDate),
                    };
                }),
            });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
//# sourceMappingURL=documentRoutes.js.map