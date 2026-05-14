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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingZoneService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
let PricingZoneService = class PricingZoneService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listZones() {
        return this.prisma.pricingZone.findMany({ orderBy: { name: 'asc' } });
    }
    async createZone(input) {
        const id = (0, uuid_1.v4)();
        await this.prisma.$queryRawUnsafe(`INSERT INTO pricing_zones (id, name, description, boundaries, "pricingRules", status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, ST_GeomFromGeoJSON($4)::geometry(Polygon, 4326), $5, $6, NOW(), NOW())`, id, input.name, input.description || null, JSON.stringify(input.boundaries), input.pricingRules, input.status ?? 'active');
        return this.prisma.pricingZone.findFirst({ where: { id } });
    }
    async patchZone(zoneId, patch) {
        const zone = await this.prisma.pricingZone.findUnique({ where: { id: zoneId } });
        if (!zone) {
            throw new common_1.NotFoundException('Pricing zone not found');
        }
        return this.prisma.pricingZone.update({ where: { id: zoneId }, data: patch });
    }
    async getZone(zoneId) {
        const zone = await this.prisma.pricingZone.findUnique({ where: { id: zoneId } });
        if (!zone) {
            throw new common_1.NotFoundException('Pricing zone not found');
        }
        return zone;
    }
    async findZoneByLocation(lat, lng) {
        const result = await this.prisma.$queryRawUnsafe(`SELECT * FROM pricing_zones
       WHERE ST_Contains(boundaries, ST_SetSRID(ST_Point($1, $2), 4326))
       AND status = 'active'
       ORDER BY "createdAt" DESC
       LIMIT 1`, lng, lat);
        return result[0] ?? null;
    }
};
exports.PricingZoneService = PricingZoneService;
exports.PricingZoneService = PricingZoneService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PricingZoneService);
//# sourceMappingURL=pricing-zone.service.js.map