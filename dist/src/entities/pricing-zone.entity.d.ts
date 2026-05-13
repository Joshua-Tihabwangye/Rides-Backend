import { Point } from 'geojson';
export declare class PricingZone {
    id: string;
    name: string;
    description: string;
    boundaries: Point[];
    pricingRules: Record<string, any>;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
