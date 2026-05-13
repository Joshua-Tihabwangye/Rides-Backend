import { DriverProfileService } from '../driver-profile/driver-profile.service';
export declare class OnboardingService {
    private readonly driverProfileService;
    constructor(driverProfileService: DriverProfileService);
    getCheckpoints(driverId: string): Promise<{
        onboardingComplete: boolean;
    }>;
}
