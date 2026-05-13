import { OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleDestroy {
    private readonly logger;
    private readonly redis;
    private readonly fallbackStore;
    constructor();
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<number>;
    getClient(): Redis;
    onModuleDestroy(): void;
    private fallbackGet;
}
