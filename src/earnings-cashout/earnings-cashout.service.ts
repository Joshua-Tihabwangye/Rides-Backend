import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EarningsCashoutService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(driverId: string, period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'week') {
    const threshold = this.periodThresholdDate(period);

    const events = await this.prisma.earningsLedger.findMany({
      where: {
        driverId,
        createdAt: { gte: threshold },
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
    return this.prisma.earningsLedger.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWallet(driverId: string) {
    const wallet = await this.prisma.walletAccount.findFirst({ where: { driverId } });
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
    const wallet = await this.prisma.walletAccount.findFirst({ where: { driverId } });
    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    if (input.amount > Number(wallet.balance)) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    await this.prisma.walletAccount.update({
      where: { id: wallet.id },
      data: { balance: Number(wallet.balance) - input.amount },
    });

    return this.prisma.cashoutRequest.create({
      data: {
        driverId,
        userId: wallet.userId,
        method: { id: input.methodId },
        amount: input.amount,
        status: 'pending',
      },
    });
  }

  async listCashoutRequests(driverId: string) {
    return this.prisma.cashoutRequest.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
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
