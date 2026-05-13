import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { WalletAccount } from '../entities/wallet-account.entity';
import { CashoutRequest } from '../entities/cashout-request.entity';

@Injectable()
export class EarningsCashoutService {
  constructor(
    @InjectRepository(EarningsLedger) private earningsRepo: Repository<EarningsLedger>,
    @InjectRepository(WalletAccount) private walletRepo: Repository<WalletAccount>,
    @InjectRepository(CashoutRequest) private cashoutRepo: Repository<CashoutRequest>,
  ) {}

  async getSummary(driverId: string, period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'week') {
    const threshold = this.periodThresholdDate(period);

    const events = await this.earningsRepo.find({
      where: {
        driverId,
        createdAt: MoreThanOrEqual(threshold),
      },
    });

    const total = events.reduce((sum, event) => sum + Number(event.amount), 0);
    return {
      period,
      total,
      currency: 'UGX',
      count: events.length,
    };
  }

  async getEvents(driverId: string) {
    return this.earningsRepo.find({
      where: { driverId },
      order: { createdAt: 'DESC' },
    });
  }

  async getWallet(driverId: string) {
    const wallet = await this.walletRepo.findOne({ where: { driverId } });
    if (!wallet) {
      return {
        driverId,
        currency: 'UGX',
        balance: 0,
      };
    }
    return wallet;
  }

  getCashoutMethods(_driverId: string) {
    return [
      { id: 'mobile-money', label: 'Mobile Money', minAmount: 5000 },
      { id: 'bank-transfer', label: 'Bank Transfer', minAmount: 20000 },
    ];
  }

  async createCashoutRequest(driverId: string, input: { methodId: string; amount: number }) {
    const wallet = await this.walletRepo.findOne({ where: { driverId } });
    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    if (input.amount > Number(wallet.balance)) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    wallet.balance = Number(wallet.balance) - input.amount;
    await this.walletRepo.save(wallet);

    const request = this.cashoutRepo.create({
      driverId,
      method: { id: input.methodId },
      amount: input.amount,
      status: 'pending',
    });
    await this.cashoutRepo.save(request);
    return request;
  }

  async listCashoutRequests(driverId: string) {
    return this.cashoutRepo.find({
      where: { driverId },
      order: { createdAt: 'DESC' },
    });
  }

  private periodThresholdDate(period: 'day' | 'week' | 'month' | 'quarter' | 'year') {
    const now = new Date();
    if (period === 'day') now.setDate(now.getDate() - 1);
    else if (period === 'week') now.setDate(now.getDate() - 7);
    else if (period === 'month') now.setMonth(now.getMonth() - 1);
    else if (period === 'quarter') now.setMonth(now.getMonth() - 3);
    else if (period === 'year') now.setFullYear(now.getFullYear() - 1);
    return now;
  }
}
