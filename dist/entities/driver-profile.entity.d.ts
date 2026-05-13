import type { Point } from 'geojson';
import { User } from './user.entity';
export declare class DriverProfile {
    id: string;
    userId: string;
    driverId: string;
    fleetId: string;
    branchId: string;
    user: User;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    driverLicenseNumber: string;
    serviceMode: string;
    preferences: Record<string, any>;
    checkpoints: Record<string, any>;
    status: string;
    onboardingStatus: string;
    currentLocation: Point;
    lastLocationAt: Date;
    rating: number;
    totalTrips: number;
}
