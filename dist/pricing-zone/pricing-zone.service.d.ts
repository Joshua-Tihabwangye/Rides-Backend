import { Repository } from 'typeorm';
import { PricingZone } from '../entities/pricing-zone.entity';
import { Polygon } from 'geojson';
export declare class PricingZoneService {
    private pricingZoneRepo;
    constructor(pricingZoneRepo: Repository<PricingZone>);
    listZones(): Promise<PricingZone[]>;
    createZone(input: {
        name: string;
        description?: string;
        boundaries: Polygon;
        pricingRules: Record<string, unknown>;
        status?: string;
    }): Promise<PricingZone>;
    patchZone(zoneId: string, patch: Partial<{
        name: string;
        description: string;
        boundaries: Polygon;
        pricingRules: Record<string, unknown>;
        status: string;
    }>): Promise<PricingZone>;
    getZone(zoneId: string): Promise<PricingZone>;
    findZoneByLocation(lat: number, lng: number): Promise<PricingZone | null>;
}
