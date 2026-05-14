import { Module } from '@nestjs/common';
import { EarningsCashoutController } from './earnings-cashout.controller';
import { EarningsCashoutService } from './earnings-cashout.service';

@Module({
  controllers: [EarningsCashoutController],
  providers: [EarningsCashoutService],
  exports: [EarningsCashoutService],
})
export class EarningsCashoutModule {}
