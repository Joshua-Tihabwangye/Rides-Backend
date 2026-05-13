"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_CORS_ORIGINS = void 0;
function parseSocketCorsOrigins(raw) {
    if (!raw?.trim()) {
        return [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
        ];
    }
    return raw
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
}
exports.SOCKET_CORS_ORIGINS = parseSocketCorsOrigins(process.env.SOCKET_CORS_ORIGINS);
//# sourceMappingURL=socket-cors.js.map