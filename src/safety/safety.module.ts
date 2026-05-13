import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SafetyController } from './safety.controller';
import { SafetyService } from './safety.service';
import { SafetyEvent } from '../entities/safety-event.entity';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { DriverProfile } from '../entities/driver-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SafetyEvent, EmergencyContact, DriverProfile]),
  ],
  controllers: [SafetyController],
  providers: [SafetyService],
  exports: [SafetyService],
})
export class SafetyModule {}
