import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;
  private readonly fallbackStore = new Map<string, { value: string; expiresAt?: number }>();
  private readonly redisDisabled: boolean;

  constructor() {
    this.redisDisabled = (process.env.REDIS_DISABLED || '').trim().toLowerCase() === 'true';
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 3000)),
    });
    if (this.redisDisabled) {
      this.logger.warn('Redis disabled by REDIS_DISABLED=true — in-memory fallback active');
      return;
    }
    this.redis.on('connect', () => this.logger.log('Redis connected'));
    this.redis.on('error', (err) => {
      const errorCode = (err as NodeJS.ErrnoException).code;
      if (errorCode === 'ECONNREFUSED' || errorCode === 'EPERM') {
        this.logger.warn('Redis not available — running without cache/session storage');
      } else {
        this.logger.error('Redis error', err);
      }
    });
    this.redis.connect().catch(() => {
      this.logger.warn('Redis connection failed — in-memory fallback active');
    });
  }

  async get(key: string): Promise<string | null> {
    if (this.redisDisabled) {
      return this.fallbackGet(key);
    }
    try {
      return await this.redis.get(key);
    } catch {
      return this.fallbackGet(key);
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.redisDisabled) {
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
      return;
    } catch {
      const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
      this.fallbackStore.set(key, { value, expiresAt });
    }
  }

  async del(key: string): Promise<void> {
    if (this.redisDisabled) {
      this.fallbackStore.delete(key);
      return;
    }
    try {
      await this.redis.del(key);
      return;
    } catch {
      this.fallbackStore.delete(key);
    }
  }

  async exists(key: string): Promise<number> {
    if (this.redisDisabled) {
      return this.fallbackGet(key) === null ? 0 : 1;
    }
    try {
      return await this.redis.exists(key);
    } catch {
      return this.fallbackGet(key) === null ? 0 : 1;
    }
  }

  getClient(): Redis {
    return this.redis;
  }

  onModuleDestroy() {
    if (!this.redisDisabled) {
      this.redis.disconnect();
    }
  }

  private fallbackGet(key: string): string | null {
    const entry = this.fallbackStore.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.fallbackStore.delete(key);
      return null;
    }

    return entry.value;
  }
}
