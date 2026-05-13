import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarningsCashoutController } from './earnings-cashout.controller';
import { EarningsCashoutService } from './earnings-cashout.service';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { WalletAccount } from '../entities/wallet-account.entity';
import { CashoutRequest } from '../entities/cashout-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EarningsLedger, WalletAccount, CashoutRequest]),
  ],
  controllers: [EarningsCashoutController],
  providers: [EarningsCashoutService],
  exports: [EarningsCashoutService],
})
export class EarningsCashoutModule {}
