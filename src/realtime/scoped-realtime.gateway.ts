import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import type { Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { SOCKET_EFFECTIVE_CORS_ORIGINS } from './socket-cors';

type ScopedGatewayData = {
  userId: string;
};

abstract class BaseScopedRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  protected abstract readonly namespaceLabel: string;
  protected readonly logger = new Logger(this.constructor.name);
  @WebSocketServer()
  protected server!: Server;

  constructor(protected readonly authService: AuthService) {}

  handleConnection(client: Socket) {
    const token = this.readToken(client);
    if (!token) {
      client.disconnect(true);
      return;
    }

    let payload: { sub: string } | null = null;
    try {
      payload = this.authService.verifyAccessToken(token);
    } catch {
      client.disconnect(true);
      return;
    }

    if (!payload) {
      client.disconnect(true);
      return;
    }

    client.data.auth = { userId: payload.sub } satisfies ScopedGatewayData;
    client.join(`${this.namespaceLabel}:${payload.sub}`);
    this.logger.log(`Socket connected for ${this.namespaceLabel} ${payload.sub}`);
  }

  handleDisconnect(client: Socket) {
    const auth = client.data.auth as ScopedGatewayData | undefined;
    if (auth) {
      this.logger.log(`Socket disconnected for ${this.namespaceLabel} ${auth.userId}`);
    }
  }

  @SubscribeMessage('subscribe')
  subscribe(@ConnectedSocket() client: Socket) {
    client.emit('subscribed', { namespace: this.namespaceLabel });
  }

  publishToUser(userId: string, event: string, payload: Record<string, unknown>) {
    if (!userId || !this.server) return;
    this.server.to(`${this.namespaceLabel}:${userId}`).emit(event, payload);
  }

  publishToAll(event: string, payload: Record<string, unknown>) {
    if (!this.server) return;
    this.server.emit(event, payload);
  }

  private readToken(client: Socket): string | null {
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

@Injectable()
@WebSocketGateway({
  namespace: '/rider',
  cors: { origin: SOCKET_EFFECTIVE_CORS_ORIGINS },
})
export class RiderRealtimeGateway extends BaseScopedRealtimeGateway {
  protected readonly namespaceLabel = 'rider';

  constructor(protected readonly authService: AuthService) {
    super(authService);
  }
}

@Injectable()
@WebSocketGateway({
  namespace: '/fleet',
  cors: { origin: SOCKET_EFFECTIVE_CORS_ORIGINS },
})
export class FleetRealtimeGateway extends BaseScopedRealtimeGateway {
  protected readonly namespaceLabel = 'fleet';

  constructor(protected readonly authService: AuthService) {
    super(authService);
  }
}

@Injectable()
@WebSocketGateway({
  namespace: '/admin',
  cors: { origin: SOCKET_EFFECTIVE_CORS_ORIGINS },
})
export class AdminRealtimeGateway extends BaseScopedRealtimeGateway {
  protected readonly namespaceLabel = 'admin';

  constructor(protected readonly authService: AuthService) {
    super(authService);
  }
}
