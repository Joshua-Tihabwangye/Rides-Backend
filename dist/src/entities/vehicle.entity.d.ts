import { Point } from 'geojson';
export declare class Vehicle {
    id: string;
    driverId: string;
    fleetPartnerId: string;
    fleetId: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    type: string;
    status: string;
    accessories: Record<string, any>;
    documents: Record<string, any>;
    socPercent: number;
    estimatedRangeKm: number;
    currentLocation: Point;
    isEv: boolean;
}
