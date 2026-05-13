import { Repository, DataSource } from 'typeorm';
import { DriverProfile } from '../entities/driver-profile.entity';
import { DriverProfileService } from '../driver-profile/driver-profile.service';
export interface NearbyDriverRecord {
    driverId: string;
    latitude: number;
    longitude: number;
    distanceMeters: number;
    accuracy?: number;
    timestamp?: number;
}
export declare class PresenceLocationService {
    private driverProfileRepo;
    private readonly driverProfileService;
    private readonly dataSource;
    constructor(driverProfileRepo: Repository<DriverProfile>, driverProfileService: DriverProfileService, dataSource: DataSource);
    goOnline(driverId: string): Promise<{
        status: string;
    }>;
    goOffline(driverId: string): Promise<{
        status: string;
    }>;
    updateLocation(driverId: string, input: {
        latitude: number;
        longitude: number;
        accuracy?: number;
        timestamp?: number;
    }): Promise<{
        driverId: string;
        latitude: number;
        longitude: number;
        accuracy: number | undefined;
        timestamp: number;
    }>;
    heartbeat(driverId: string, input: {
        latitude: number;
        longitude: number;
        accuracy?: number;
        timestamp?: number;
    }): Promise<{
        driverId: string;
        latitude: number;
        longitude: number;
        accuracy: number | undefined;
        timestamp: number;
    }>;
    findNearbyDrivers(latitude: number, longitude: number, radiusMeters: number): Promise<NearbyDriverRecord[]>;
}
