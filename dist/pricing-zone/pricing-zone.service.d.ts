import { PrismaService } from '../prisma/prisma.service';
import type { Polygon } from 'geojson';
export declare class PricingZoneService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listZones(): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createZone(input: {
        name: string;
        description?: string;
        boundaries: Polygon;
        pricingRules: Record<string, unknown>;
        status?: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    patchZone(zoneId: string, patch: Partial<{
        name: string;
        description: string;
        boundaries: Polygon;
        pricingRules: Record<string, unknown>;
        status: string;
    }>): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getZone(zoneId: string): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findZoneByLocation(lat: number, lng: number): Promise<any>;
}
