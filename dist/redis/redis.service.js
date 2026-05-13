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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    constructor() {
        this.logger = new common_1.Logger(RedisService_1.name);
        this.fallbackStore = new Map();
        this.redisDisabled = (process.env.REDIS_DISABLED || '').trim().toLowerCase() === 'true';
        this.redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
            lazyConnect: true,
            retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 3000)),
        });
        if (this.redisDisabled) {
            this.logger.warn('Redis disabled by REDIS_DISABLED=true — in-memory fallback active');
            return;
        }
        this.redis.on('connect', () => this.logger.log('Redis connected'));
        this.redis.on('error', (err) => {
            const errorCode = err.code;
            if (errorCode === 'ECONNREFUSED' || errorCode === 'EPERM') {
                this.logger.warn('Redis not available — running without cache/session storage');
            }
            else {
                this.logger.error('Redis error', err);
            }
        });
        this.redis.connect().catch(() => {
            this.logger.warn('Redis connection failed — in-memory fallback active');
        });
    }
    async get(key) {
        if (this.redisDisabled) {
            return this.fallbackGet(key);
        }
        try {
            return await this.redis.get(key);
        }
        catch {
            return this.fallbackGet(key);
        }
    }
    async set(key, value, ttlSeconds) {
        if (this.redisDisabled) {
            const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
            this.fallbackStore.set(key, { value, expiresAt });
            return;
        }
        try {
            if (ttlSeconds) {
                await this.redis.setex(key, ttlSeconds, value);
            }
            else {
                await this.redis.set(key, value);
            }
            return;
        }
        catch {
            const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
            this.fallbackStore.set(key, { value, expiresAt });
        }
    }
    async del(key) {
        if (this.redisDisabled) {
            this.fallbackStore.delete(key);
            return;
        }
        try {
            await this.redis.del(key);
            return;
        }
        catch {
            this.fallbackStore.delete(key);
        }
    }
    async exists(key) {
        if (this.redisDisabled) {
            return this.fallbackGet(key) === null ? 0 : 1;
        }
        try {
            return await this.redis.exists(key);
        }
        catch {
            return this.fallbackGet(key) === null ? 0 : 1;
        }
    }
    getClient() {
        return this.redis;
    }
    onModuleDestroy() {
        if (!this.redisDisabled) {
            this.redis.disconnect();
        }
    }
    fallbackGet(key) {
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
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);
//# sourceMappingURL=redis.service.js.map