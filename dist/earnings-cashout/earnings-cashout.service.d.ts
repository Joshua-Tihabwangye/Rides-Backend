import { Repository } from 'typeorm';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { WalletAccount } from '../entities/wallet-account.entity';
import { CashoutRequest } from '../entities/cashout-request.entity';
export declare class EarningsCashoutService {
    private earningsRepo;
    private walletRepo;
    private cashoutRepo;
    constructor(earningsRepo: Repository<EarningsLedger>, walletRepo: Repository<WalletAccount>, cashoutRepo: Repository<CashoutRequest>);
    getSummary(driverId: string, period?: 'day' | 'week' | 'month' | 'quarter' | 'year'): Promise<{
        period: "day" | "week" | "month" | "quarter" | "year";
        total: number;
        currency: string;
        count: number;
    }>;
    getEvents(driverId: string): Promise<EarningsLedger[]>;
    getWallet(driverId: string): Promise<WalletAccount | {
        driverId: string;
        currency: string;
        balance: number;
    }>;
    getCashoutMethods(_driverId: string): {
        id: string;
        label: string;
        minAmount: number;
    }[];
    createCashoutRequest(driverId: string, input: {
        methodId: string;
        amount: number;
    }): Promise<CashoutRequest>;
    listCashoutRequests(driverId: string): Promise<CashoutRequest[]>;
    private periodThresholdDate;
}
