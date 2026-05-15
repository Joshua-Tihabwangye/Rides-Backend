import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

interface FallbackEntry {
  value: string;
  expiresAt?: number;
}

type MessageHandler = (channel: string, message: string) => void;

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;
  private readonly pub: Redis;
  private readonly sub: Redis;
  private readonly fallbackStore = new Map<string, FallbackEntry>();
  private readonly fallbackPubSub = new Map<string, Set<MessageHandler>>();
  private readonly redisDisabled: boolean;
  private connected = false;

  constructor() {
    this.redisDisabled = (process.env.REDIS_DISABLED || '').trim().toLowerCase() === 'true';
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    this.redis = new Redis(redisUrl, {
      lazyConnect: true,
      retryStrategy: (times) => (times > 5 ? null : Math.min(times * 200, 5000)),
      maxRetriesPerRequest: 3,
    });

    this.pub = new Redis(redisUrl, {
      lazyConnect: true,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 5000)),
    });

    this.sub = new Redis(redisUrl, {
      lazyConnect: true,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 5000)),
    });

    if (this.redisDisabled) {
      this.logger.warn('Redis disabled by REDIS_DISABLED=true — in-memory fallback active');
      return;
    }

    [this.redis, this.pub, this.sub].forEach((client) => {
      client.on('connect', () => {
        this.connected = true;
        this.logger.log(`Redis client connected (${client.options.connectionName || 'default'})`);
      });
      client.on('error', (err) => {
        this.connected = false;
        const errorCode = (err as NodeJS.ErrnoException).code;
        if (errorCode === 'ECONNREFUSED' || errorCode === 'EPERM') {
          this.logger.warn('Redis not available — running without cache/session storage');
        } else {
          this.logger.error('Redis error', err);
        }
      });
    });

    this.redis.connect().catch(() => {
      this.logger.warn('Redis connection failed — in-memory fallback active');
    });
    this.pub.connect().catch(() => {});
    this.sub.connect().catch(() => {});
  }

  /* ─── Key/Value Operations ─── */

  async get(key: string): Promise<string | null> {
    if (this.redisDisabled || !this.connected) {
      return this.fallbackGet(key);
    }
    try {
      return await this.redis.get(key);
    } catch {
      return this.fallbackGet(key);
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.redisDisabled || !this.connected) {
      const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
      this.fallbackStore.set(key, { value, expiresAt });
      return;
    }
    try {
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, value);
      } else {
        await this.redis.set(key, value);
      }
    } catch {
      const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
      this.fallbackStore.set(key, { value, expiresAt });
    }
  }

  async del(key: string): Promise<void> {
    if (this.redisDisabled || !this.connected) {
      this.fallbackStore.delete(key);
      return;
    }
    try {
      await this.redis.del(key);
    } catch {
      this.fallbackStore.delete(key);
    }
  }

  async exists(key: string): Promise<number> {
    if (this.redisDisabled || !this.connected) {
      return this.fallbackGet(key) === null ? 0 : 1;
    }
    try {
      return await this.redis.exists(key);
    } catch {
      return this.fallbackGet(key) === null ? 0 : 1;
    }
  }

  async getJson<T = unknown>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setJson<T = unknown>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  /* ─── Hash Operations ─── */

  async hget(key: string, field: string): Promise<string | null> {
    if (this.redisDisabled || !this.connected) return null;
    try { return await this.redis.hget(key, field); } catch { return null; }
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    if (this.redisDisabled || !this.connected) return;
    try { await this.redis.hset(key, field, value); } catch { /* noop */ }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    if (this.redisDisabled || !this.connected) return {};
    try { return await this.redis.hgetall(key); } catch { return {}; }
  }

  /* ─── Pub/Sub ─── */

  async publish(channel: string, message: string | object): Promise<void> {
    const payload = typeof message === 'string' ? message : JSON.stringify(message);
    if (this.redisDisabled || !this.connected) {
      const handlers = this.fallbackPubSub.get(channel);
      if (handlers) {
        handlers.forEach((h) => {
          try { h(channel, payload); } catch (e) { this.logger.error('PubSub handler error', e); }
        });
      }
      return;
    }
    try {
      await this.pub.publish(channel, payload);
    } catch (err) {
      this.logger.warn(`Redis publish failed for ${channel}`, err);
    }
  }

  async subscribe(channel: string, handler: MessageHandler): Promise<void> {
    if (this.redisDisabled || !this.connected) {
      if (!this.fallbackPubSub.has(channel)) {
        this.fallbackPubSub.set(channel, new Set());
      }
      this.fallbackPubSub.get(channel)!.add(handler);
      return;
    }
    try {
      this.sub.on('message', (ch: string, msg: string) => {
        if (ch === channel) {
          try { handler(ch, msg); } catch (e) { this.logger.error('PubSub handler error', e); }
        }
      });
      await this.sub.subscribe(channel);
    } catch (err) {
      this.logger.warn(`Redis subscribe failed for ${channel}`, err);
    }
  }

  async unsubscribe(channel: string, handler?: MessageHandler): Promise<void> {
    if (this.redisDisabled || !this.connected) {
      const handlers = this.fallbackPubSub.get(channel);
      if (handlers) {
        if (handler) handlers.delete(handler);
        else handlers.clear();
      }
      return;
    }
    try {
      if (!handler) {
        this.sub.removeAllListeners('message');
        await this.sub.unsubscribe(channel);
      }
    } catch (err) {
      this.logger.warn(`Redis unsubscribe failed for ${channel}`, err);
    }
  }

  /* ─── Client Access ─── */

  getClient(): Redis {
    return this.redis;
  }

  isConnected(): boolean {
    return this.connected;
  }

  onModuleDestroy() {
    if (!this.redisDisabled) {
      this.redis.disconnect();
      this.pub.disconnect();
      this.sub.disconnect();
    }
  }

  /* ─── Fallback Helpers ─── */

  private fallbackGet(key: string): string | null {
    const entry = this.fallbackStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.fallbackStore.delete(key);
      return null;
    }
    return entry.value;
  }
}
