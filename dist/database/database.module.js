"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const promises_1 = require("node:dns/promises");
const role_entity_1 = require("../entities/role.entity");
const seeder_service_1 = require("./seeder.service");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: async () => {
                    const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL;
                    const isNeon = process.env.DB_HOST?.includes('neon.tech') || databaseUrl?.includes('neon.tech');
                    const useSsl = isNeon || process.env.DB_SSL === 'true';
                    const forceIpv4 = process.env.DB_FORCE_IPV4 !== 'false';
                    const retryAttempts = Number.parseInt(process.env.DB_RETRY_ATTEMPTS || '10', 10);
                    const retryDelay = Number.parseInt(process.env.DB_RETRY_DELAY_MS || '3000', 10);
                    const connectTimeoutMS = Number.parseInt(process.env.DB_CONNECT_TIMEOUT_MS || '15000', 10);
                    let urlConfig = null;
                    let neonHostName = null;
                    let resolvedIpv4Host = null;
                    if (databaseUrl) {
                        try {
                            urlConfig = new URL(databaseUrl);
                            neonHostName = urlConfig.hostname;
                        }
                        catch {
                            urlConfig = null;
                        }
                    }
                    if (isNeon && forceIpv4 && neonHostName) {
                        try {
                            const ipv4Addresses = await (0, promises_1.resolve4)(neonHostName);
                            if (ipv4Addresses.length > 0) {
                                resolvedIpv4Host = ipv4Addresses[0];
                            }
                        }
                        catch {
                            resolvedIpv4Host = null;
                        }
                    }
                    const useResolvedIpv4 = Boolean(isNeon && resolvedIpv4Host && urlConfig);
                    const parsedPort = urlConfig?.port ? Number.parseInt(urlConfig.port, 10) : 5432;
                    const parsedDatabase = urlConfig?.pathname ? decodeURIComponent(urlConfig.pathname.replace(/^\//, '')) : undefined;
                    return {
                        type: 'postgres',
                        url: useResolvedIpv4 ? undefined : databaseUrl,
                        host: useResolvedIpv4
                            ? resolvedIpv4Host
                            : databaseUrl
                                ? undefined
                                : (process.env.DB_HOST || 'localhost'),
                        port: useResolvedIpv4 ? parsedPort : databaseUrl ? undefined : parseInt(process.env.DB_PORT || '5432'),
                        username: useResolvedIpv4
                            ? decodeURIComponent(urlConfig.username)
                            : databaseUrl
                                ? undefined
                                : (process.env.DB_USER || 'evzone'),
                        password: useResolvedIpv4
                            ? decodeURIComponent(urlConfig.password)
                            : databaseUrl
                                ? undefined
                                : (process.env.DB_PASSWORD || 'evzone_dev_pass'),
                        database: useResolvedIpv4 ? parsedDatabase : databaseUrl ? undefined : (process.env.DB_NAME || 'evzone'),
                        ssl: useSsl
                            ? {
                                rejectUnauthorized: false,
                                ...(useResolvedIpv4 && neonHostName ? { servername: neonHostName } : {}),
                            }
                            : undefined,
                        connectTimeoutMS,
                        extra: isNeon
                            ? {
                                application_name: process.env.DB_APP_NAME || 'evzone-backend',
                                keepAlive: true,
                                family: forceIpv4 ? 4 : undefined,
                                connectionTimeoutMillis: connectTimeoutMS,
                            }
                            : undefined,
                        retryAttempts: Number.isFinite(retryAttempts) ? retryAttempts : 10,
                        retryDelay: Number.isFinite(retryDelay) ? retryDelay : 3000,
                        entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
                        synchronize: process.env.NODE_ENV !== 'production',
                        logging: process.env.NODE_ENV === 'development',
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role]),
        ],
        providers: [seeder_service_1.SeederService],
        exports: [typeorm_1.TypeOrmModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map