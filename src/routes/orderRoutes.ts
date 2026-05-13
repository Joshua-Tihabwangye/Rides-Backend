import { Router } from "express";
import type { DriverDocumentRepository } from "../repositories/documentRepository";
import { requireValidDocuments } from "../middleware/requireValidDocuments";

export function createOrderRoutes(repository: DriverDocumentRepository) {
  const router = Router();

  // Protect order access with document expiry checks.
  router.get("/drivers/:driverId/orders", requireValidDocuments(repository), async (_req, res) => {
    return res.json({
      orders: [],
    });
  });

  return router;
}
