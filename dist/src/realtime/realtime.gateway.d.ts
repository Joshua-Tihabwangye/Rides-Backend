import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    server: Server;
    private readonly logger;
    constructor(authService: AuthService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    subscribe(client: Socket, body: {
        channel: 'trip' | 'delivery-route';
        id: string;
    }): void;
    locationUpdate(client: Socket, body: {
        tripId?: string;
        latitude: number;
        longitude: number;
        timestamp?: number;
    }): void;
    jobOfferResponse(client: Socket, body: {
        jobId: string;
        action: 'accept' | 'reject';
    }): void;
    tripAck(client: Socket, body: {
        tripId: string;
        event: string;
    }): void;
    publishEvent(input: {
        driverId?: string;
        tripId?: string;
        routeId?: string;
        event: string;
        payload: Record<string, unknown>;
    }): void;
    private readToken;
}
