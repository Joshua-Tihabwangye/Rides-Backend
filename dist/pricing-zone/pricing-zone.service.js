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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingZoneService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pricing_zone_entity_1 = require("../entities/pricing-zone.entity");
let PricingZoneService = class PricingZoneService {
    constructor(pricingZoneRepo) {
        this.pricingZoneRepo = pricingZoneRepo;
    }
    async listZones() {
        return this.pricingZoneRepo.find({ order: { name: 'ASC' } });
    }
    async createZone(input) {
        const zone = this.pricingZoneRepo.create({
            ...input,
            status: input.status ?? 'active',
        });
        return this.pricingZoneRepo.save(zone);
    }
    async patchZone(zoneId, patch) {
        const zone = await this.pricingZoneRepo.findOne({ where: { id: zoneId } });
        if (!zone) {
            throw new common_1.NotFoundException('Pricing zone not found');
        }
        Object.assign(zone, patch);
        return this.pricingZoneRepo.save(zone);
    }
    async getZone(zoneId) {
        const zone = await this.pricingZoneRepo.findOne({ where: { id: zoneId } });
        if (!zone) {
            throw new common_1.NotFoundException('Pricing zone not found');
        }
        return zone;
    }
    async findZoneByLocation(lat, lng) {
        const result = await this.pricingZoneRepo
            .createQueryBuilder('zone')
            .where('ST_Contains(zone.boundaries, ST_SetSRID(ST_Point(:lng, :lat), 4326))', { lat, lng })
            .andWhere('zone.status = :status', { status: 'active' })
            .orderBy('zone.createdAt', 'DESC')
            .getOne();
        return result ?? null;
    }
};
exports.PricingZoneService = PricingZoneService;
exports.PricingZoneService = PricingZoneService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pricing_zone_entity_1.PricingZone)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PricingZoneService);
//# sourceMappingURL=pricing-zone.service.js.map