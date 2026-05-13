"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = getJwtSecret;
const DEV_FALLBACK_SECRET = 'dev-insecure-change-me';
function getJwtSecret() {
    const configured = process.env.JWT_SECRET?.trim();
    if (configured) {
        return configured;
    }
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be configured in production');
    }
    return DEV_FALLBACK_SECRET;
}
//# sourceMappingURL=jwt-secret.js.map