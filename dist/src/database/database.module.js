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
const role_entity_1 = require("../entities/role.entity");
const seeder_service_1 = require("./seeder.service");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => {
                    const isNeon = process.env.DB_HOST?.includes('neon.tech') || process.env.DATABASE_URL?.includes('neon.tech');
                    const useSsl = isNeon || process.env.DB_SSL === 'true';
                    return {
                        type: 'postgres',
                        url: process.env.DATABASE_URL,
                        host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || 'localhost'),
                        port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
                        username: process.env.DATABASE_URL ? undefined : (process.env.DB_USER || 'evzone'),
                        password: process.env.DATABASE_URL ? undefined : (process.env.DB_PASSWORD || 'evzone_dev_pass'),
                        database: process.env.DATABASE_URL ? undefined : (process.env.DB_NAME || 'evzone'),
                        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
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