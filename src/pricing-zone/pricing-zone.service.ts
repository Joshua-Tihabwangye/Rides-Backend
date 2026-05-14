import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import type { Polygon } from 'geojson';

@Injectable()
export class PricingZoneService {
  constructor(private readonly prisma: PrismaService) {}

  async listZones() {
    return this.prisma.pricingZone.findMany({ orderBy: { name: 'asc' } });
  }

  async createZone(input: {
    name: string;
    description?: string;
    boundaries: Polygon;
    pricingRules: Record<string, unknown>;
    status?: string;
  }) {
    const id = uuidv4();
    await this.prisma.$queryRawUnsafe(
      `INSERT INTO pricing_zones (id, name, description, boundaries, "pricingRules", status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, ST_GeomFromGeoJSON($4)::geometry(Polygon, 4326), $5, $6, NOW(), NOW())`,
      id,
      input.name,
      input.description || null,
      JSON.stringify(input.boundaries),
      input.pricingRules as any,
      input.status ?? 'active',
    );
    return this.prisma.pricingZone.findFirst({ where: { id } });
  }

  async patchZone(zoneId: string, patch: Partial<{
    name: string;
    description: string;
    boundaries: Polygon;
    pricingRules: Record<string, unknown>;
    status: string;
  }>) {
    const zone = await this.prisma.pricingZone.findUnique({ where: { id: zoneId } });
    if (!zone) {
      throw new NotFoundException('Pricing zone not found');
    }
    return this.prisma.pricingZone.update({ where: { id: zoneId }, data: patch as any });
  }

  async getZone(zoneId: string) {
    const zone = await this.prisma.pricingZone.findUnique({ where: { id: zoneId } });
    if (!zone) {
      throw new NotFoundException('Pricing zone not found');
    }
    return zone;
  }

  async findZoneByLocation(lat: number, lng: number) {
    const result = await this.prisma.$queryRawUnsafe<Array<any>>(
      `SELECT * FROM pricing_zones
       WHERE ST_Contains(boundaries, ST_SetSRID(ST_Point($1, $2), 4326))
       AND status = 'active'
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      lng,
      lat,
    );

    return result[0] ?? null;
  }
}
