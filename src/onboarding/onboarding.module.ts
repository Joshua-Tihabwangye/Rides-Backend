import { Module } from '@nestjs/common';
import { DriverProfileModule } from '../driver-profile/driver-profile.module';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

@Module({
  imports: [DriverProfileModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
