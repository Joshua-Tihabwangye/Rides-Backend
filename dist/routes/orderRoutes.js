"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderRoutes = createOrderRoutes;
const express_1 = require("express");
const requireValidDocuments_1 = require("../middleware/requireValidDocuments");
function createOrderRoutes(repository) {
    const router = (0, express_1.Router)();
    router.get("/drivers/:driverId/orders", (0, requireValidDocuments_1.requireValidDocuments)(repository), async (_req, res) => {
        return res.json({
            orders: [],
        });
    });
    return router;
}
//# sourceMappingURL=orderRoutes.js.map