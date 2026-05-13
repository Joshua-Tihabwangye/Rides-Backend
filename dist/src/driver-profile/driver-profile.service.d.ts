import { Repository } from 'typeorm';
import { DriverProfile } from '../entities/driver-profile.entity';
import { User } from '../entities/user.entity';
export declare class DriverProfileService {
    private driverProfileRepo;
    private userRepo;
    constructor(driverProfileRepo: Repository<DriverProfile>, userRepo: Repository<User>);
    getProfile(driverId: string): Promise<DriverProfile>;
    updateProfile(driverId: string, patch: Partial<{
        fullName: string;
        phone: string;
        city: string;
        country: string;
    }>): Promise<DriverProfile>;
    getPreferences(driverId: string): Promise<Record<string, any>>;
    updatePreferences(driverId: string, patch: Partial<{
        areaIds: string[];
        serviceIds: string[];
        requirementIds: string[];
    }>): Promise<Record<string, any>>;
    getCheckpoints(driverId: string): Promise<{
        onboardingComplete: boolean;
    }>;
}
