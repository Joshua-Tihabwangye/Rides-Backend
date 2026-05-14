import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminConfigController } from './admin-config.controller';
import { AdminOperationsController } from './admin-operations.controller';
import { AdminSystemController } from './admin-system.controller';
import { AdminUsersController } from './admin-users.controller';
import { AdminPricingZoneController } from './admin-pricing-zone.controller';
import { AdminCompatController } from './admin-compat.controller';
import { AdminService } from './admin.service';
import { PricingZoneModule } from '../pricing-zone/pricing-zone.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [PricingZoneModule, RealtimeModule],
  controllers: [
    AdminController,
    AdminUsersController,
    AdminOperationsController,
    AdminConfigController,
    AdminSystemController,
    AdminPricingZoneController,
    AdminCompatController,
  ],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
