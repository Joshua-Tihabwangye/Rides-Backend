import { Injectable } from '@nestjs/common';
import { DriverProfileService } from '../driver-profile/driver-profile.service';

@Injectable()
export class OnboardingService {
  constructor(private readonly driverProfileService: DriverProfileService) {}

  getCheckpoints(driverId: string) {
    return this.driverProfileService.getCheckpoints(driverId);
  }
}
