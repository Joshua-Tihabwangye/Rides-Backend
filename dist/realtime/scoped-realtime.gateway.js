"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRealtimeGateway = exports.FleetRealtimeGateway = exports.RiderRealtimeGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const auth_service_1 = require("../auth/auth.service");
const socket_cors_1 = require("./socket-cors");
class BaseScopedRealtimeGateway {
    constructor(authService) {
        this.authService = authService;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    handleConnection(client) {
        const token = this.readToken(client);
        if (!token) {
            client.disconnect(true);
            return;
        }
        let payload = null;
        try {
            payload = this.authService.verifyAccessToken(token);
        }
        catch {
            client.disconnect(true);
            return;
        }
        if (!payload) {
            client.disconnect(true);
            return;
        }
        client.data.auth = { userId: payload.sub };
        client.join(`${this.namespaceLabel}:${payload.sub}`);
        this.logger.log(`Socket connected for ${this.namespaceLabel} ${payload.sub}`);
    }
    handleDisconnect(client) {
        const auth = client.data.auth;
        if (auth) {
            this.logger.log(`Socket disconnected for ${this.namespaceLabel} ${auth.userId}`);
        }
    }
    subscribe(client) {
        client.emit('subscribed', { namespace: this.namespaceLabel });
    }
    publishToUser(userId, event, payload) {
        if (!userId || !this.server)
            return;
        this.server.to(`${this.namespaceLabel}:${userId}`).emit(event, payload);
    }
    publishToAll(event, payload) {
        if (!this.server)
            return;
        this.server.emit(event, payload);
    }
    readToken(client) {
        const authToken = client.handshake.auth?.token;
        if (typeof authToken === 'string' && authToken.trim()) {
            return authToken;
        }
        const header = client.handshake.headers.authorization;
        if (typeof header === 'string' && header.startsWith('Bearer ')) {
            return header.slice('Bearer '.length);
        }
        return null;
    }
}
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], BaseScopedRealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], BaseScopedRealtimeGateway.prototype, "subscribe", null);
let RiderRealtimeGateway = class RiderRealtimeGateway extends BaseScopedRealtimeGateway {
    constructor(authService) {
        super(authService);
        this.authService = authService;
        this.namespaceLabel = 'rider';
    }
};
exports.RiderRealtimeGateway = RiderRealtimeGateway;
exports.RiderRealtimeGateway = RiderRealtimeGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        namespace: '/rider',
        cors: { origin: socket_cors_1.SOCKET_EFFECTIVE_CORS_ORIGINS },
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], RiderRealtimeGateway);
let FleetRealtimeGateway = class FleetRealtimeGateway extends BaseScopedRealtimeGateway {
    constructor(authService) {
        super(authService);
        this.authService = authService;
        this.namespaceLabel = 'fleet';
    }
};
exports.FleetRealtimeGateway = FleetRealtimeGateway;
exports.FleetRealtimeGateway = FleetRealtimeGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        namespace: '/fleet',
        cors: { origin: socket_cors_1.SOCKET_EFFECTIVE_CORS_ORIGINS },
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], FleetRealtimeGateway);
let AdminRealtimeGateway = class AdminRealtimeGateway extends BaseScopedRealtimeGateway {
    constructor(authService) {
        super(authService);
        this.authService = authService;
        this.namespaceLabel = 'admin';
    }
};
exports.AdminRealtimeGateway = AdminRealtimeGateway;
exports.AdminRealtimeGateway = AdminRealtimeGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        namespace: '/admin',
        cors: { origin: socket_cors_1.SOCKET_EFFECTIVE_CORS_ORIGINS },
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AdminRealtimeGateway);
//# sourceMappingURL=scoped-realtime.gateway.js.map