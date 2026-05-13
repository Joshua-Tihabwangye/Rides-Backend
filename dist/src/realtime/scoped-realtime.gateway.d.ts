import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
declare abstract class BaseScopedRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    protected readonly authService: AuthService;
    protected abstract readonly namespaceLabel: string;
    protected readonly logger: Logger;
    constructor(authService: AuthService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    subscribe(client: Socket): void;
    private readToken;
}
export declare class RiderRealtimeGateway extends BaseScopedRealtimeGateway {
    protected readonly namespaceLabel = "rider";
}
export declare class FleetRealtimeGateway extends BaseScopedRealtimeGateway {
    protected readonly namespaceLabel = "fleet";
}
export declare class AdminRealtimeGateway extends BaseScopedRealtimeGateway {
    protected readonly namespaceLabel = "admin";
}
export {};
