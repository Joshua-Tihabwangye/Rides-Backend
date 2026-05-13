import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import type { Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
declare abstract class BaseScopedRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    protected readonly authService: AuthService;
    protected abstract readonly namespaceLabel: string;
    protected readonly logger: Logger;
    protected server: Server;
    constructor(authService: AuthService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    subscribe(client: Socket): void;
    publishToUser(userId: string, event: string, payload: Record<string, unknown>): void;
    publishToAll(event: string, payload: Record<string, unknown>): void;
    private readToken;
}
export declare class RiderRealtimeGateway extends BaseScopedRealtimeGateway {
    protected readonly authService: AuthService;
    protected readonly namespaceLabel = "rider";
    constructor(authService: AuthService);
}
export declare class FleetRealtimeGateway extends BaseScopedRealtimeGateway {
    protected readonly authService: AuthService;
    protected readonly namespaceLabel = "fleet";
    constructor(authService: AuthService);
}
export declare class AdminRealtimeGateway extends BaseScopedRealtimeGateway {
    protected readonly authService: AuthService;
    protected readonly namespaceLabel = "admin";
    constructor(authService: AuthService);
}
export {};
