"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestId = getRequestId;
const crypto_1 = require("crypto");
function getRequestId(req) {
    const headerId = req.headers['x-request-id'];
    if (typeof headerId === 'string' && headerId.trim()) {
        return headerId;
    }
    return (0, crypto_1.randomUUID)();
}
//# sourceMappingURL=request-id.js.map