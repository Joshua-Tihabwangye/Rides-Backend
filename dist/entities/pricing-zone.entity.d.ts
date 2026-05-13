import type { Polygon } from 'geojson';
export declare class PricingZone {
    id: string;
    name: string;
    description: string;
    boundaries: Polygon;
    pricingRules: Record<string, any>;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
