import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverProfileController } from './driver-profile.controller';
import { DriverProfileService } from './driver-profile.service';
import { DriverProfile } from '../entities/driver-profile.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverProfile, User])],
  controllers: [DriverProfileController],
  providers: [DriverProfileService],
  exports: [DriverProfileService],
})
export class DriverProfileModule {}
