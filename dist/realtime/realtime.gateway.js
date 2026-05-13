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
var RealtimeGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const socket_cors_1 = require("./socket-cors");
let RealtimeGateway = RealtimeGateway_1 = class RealtimeGateway {
    constructor(authService) {
        this.authService = authService;
        this.logger = new common_1.Logger(RealtimeGateway_1.name);
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
        const data = {
            userId: payload.sub,
        };
        client.data.auth = data;
        client.join(`driver:${payload.sub}`);
        this.logger.log(`Socket connected for driver ${payload.sub}`);
    }
    handleDisconnect(client) {
        const auth = client.data.auth;
        if (auth) {
            this.logger.log(`Socket disconnected for driver ${auth.userId}`);
        }
    }
    subscribe(client, body) {
        if (!body?.id || !body?.channel) {
            client.emit('error', { code: 'INVALID_SUBSCRIPTION', message: 'channel and id are required' });
            return;
        }
        const room = `${body.channel}:${body.id}`;
        client.join(room);
        client.emit('subscribed', { room });
    }
    locationUpdate(client, body) {
        const auth = client.data.auth;
        if (!auth) {
            client.emit('error', { code: 'UNAUTHORIZED', message: 'Unauthorized socket' });
            return;
        }
        const payload = {
            driverId: auth.userId,
            ...body,
            timestamp: body.timestamp ?? Date.now(),
        };
        this.server.to(`driver:${auth.userId}`).emit('trip.location.updated', payload);
        if (body.tripId) {
            this.server.to(`trip:${body.tripId}`).emit('trip.location.updated', payload);
        }
    }
    jobOfferResponse(client, body) {
        const auth = client.data.auth;
        if (!auth) {
            client.emit('error', { code: 'UNAUTHORIZED', message: 'Unauthorized socket' });
            return;
        }
        this.server.to(`driver:${auth.userId}`).emit('job.offer.updated', {
            jobId: body.jobId,
            action: body.action,
            driverId: auth.userId,
            timestamp: Date.now(),
        });
    }
    tripAck(client, body) {
        const auth = client.data.auth;
        if (!auth) {
            client.emit('error', { code: 'UNAUTHORIZED', message: 'Unauthorized socket' });
            return;
        }
        client.emit('trip.ack.received', {
            tripId: body.tripId,
            event: body.event,
            receivedAt: Date.now(),
        });
    }
    publishEvent(input) {
        if (input.driverId) {
            this.server.to(`driver:${input.driverId}`).emit(input.event, input.payload);
        }
        if (input.tripId) {
            this.server.to(`trip:${input.tripId}`).emit(input.event, input.payload);
        }
        if (input.routeId) {
            this.server.to(`delivery-route:${input.routeId}`).emit(input.event, input.payload);
        }
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
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "subscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('location.update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "locationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('job.offer.response'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "jobOfferResponse", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('trip.ack'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "tripAck", null);
exports.RealtimeGateway = RealtimeGateway = RealtimeGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        namespace: '/driver',
        cors: { origin: socket_cors_1.SOCKET_EFFECTIVE_CORS_ORIGINS },
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map