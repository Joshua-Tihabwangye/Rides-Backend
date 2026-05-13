import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingZone } from '../entities/pricing-zone.entity';
import type { Polygon } from 'geojson';

@Injectable()
export class PricingZoneService {
  constructor(
    @InjectRepository(PricingZone) private pricingZoneRepo: Repository<PricingZone>,
  ) {}

  async listZones() {
    return this.pricingZoneRepo.find({ order: { name: 'ASC' } });
  }

  async createZone(input: {
    name: string;
    description?: string;
    boundaries: Polygon;
    pricingRules: Record<string, unknown>;
    status?: string;
  }) {
    const zone = this.pricingZoneRepo.create({
      ...input,
      status: input.status ?? 'active',
    });
    return this.pricingZoneRepo.save(zone);
  }

  async patchZone(zoneId: string, patch: Partial<{
    name: string;
    description: string;
    boundaries: Polygon;
    pricingRules: Record<string, unknown>;
    status: string;
  }>) {
    const zone = await this.pricingZoneRepo.findOne({ where: { id: zoneId } });
    if (!zone) {
      throw new NotFoundException('Pricing zone not found');
    }
    Object.assign(zone, patch);
    return this.pricingZoneRepo.save(zone);
  }

  async getZone(zoneId: string) {
    const zone = await this.pricingZoneRepo.findOne({ where: { id: zoneId } });
    if (!zone) {
      throw new NotFoundException('Pricing zone not found');
    }
    return zone;
  }

  async findZoneByLocation(lat: number, lng: number) {
    const result = await this.pricingZoneRepo
      .createQueryBuilder('zone')
      .where('ST_Contains(zone.boundaries, ST_SetSRID(ST_Point(:lng, :lat), 4326))', { lat, lng })
      .andWhere('zone.status = :status', { status: 'active' })
      .orderBy('zone.createdAt', 'DESC')
      .getOne();

    return result ?? null;
  }
}
