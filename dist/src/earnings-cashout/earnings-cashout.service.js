"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningsCashoutService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const earnings_ledger_entity_1 = require("../entities/earnings-ledger.entity");
const wallet_account_entity_1 = require("../entities/wallet-account.entity");
const cashout_request_entity_1 = require("../entities/cashout-request.entity");
let EarningsCashoutService = class EarningsCashoutService {
    constructor(earningsRepo, walletRepo, cashoutRepo) {
        this.earningsRepo = earningsRepo;
        this.walletRepo = walletRepo;
        this.cashoutRepo = cashoutRepo;
    }
    async getSummary(driverId, period = 'week') {
        const threshold = this.periodThresholdDate(period);
        const events = await this.earningsRepo.find({
            where: {
                driverId,
                createdAt: (0, typeorm_2.MoreThanOrEqual)(threshold),
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
    async getEvents(driverId) {
        return this.earningsRepo.find({
            where: { driverId },
            order: { createdAt: 'DESC' },
        });
    }
    async getWallet(driverId) {
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
    getCashoutMethods(_driverId) {
        return [
            { id: 'mobile-money', label: 'Mobile Money', minAmount: 5000 },
            { id: 'bank-transfer', label: 'Bank Transfer', minAmount: 20000 },
        ];
    }
    async createCashoutRequest(driverId, input) {
        const wallet = await this.walletRepo.findOne({ where: { driverId } });
        if (!wallet) {
            throw new common_1.BadRequestException('Wallet not found');
        }
        if (input.amount > Number(wallet.balance)) {
            throw new common_1.BadRequestException('Insufficient wallet balance');
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
    async listCashoutRequests(driverId) {
        return this.cashoutRepo.find({
            where: { driverId },
            order: { createdAt: 'DESC' },
        });
    }
    periodThresholdDate(period) {
        const now = new Date();
        if (period === 'day')
            now.setDate(now.getDate() - 1);
        else if (period === 'week')
            now.setDate(now.getDate() - 7);
        else if (period === 'month')
            now.setMonth(now.getMonth() - 1);
        else if (period === 'quarter')
            now.setMonth(now.getMonth() - 3);
        else if (period === 'year')
            now.setFullYear(now.getFullYear() - 1);
        return now;
    }
};
exports.EarningsCashoutService = EarningsCashoutService;
exports.EarningsCashoutService = EarningsCashoutService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(earnings_ledger_entity_1.EarningsLedger)),
    __param(1, (0, typeorm_1.InjectRepository)(wallet_account_entity_1.WalletAccount)),
    __param(2, (0, typeorm_1.InjectRepository)(cashout_request_entity_1.CashoutRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EarningsCashoutService);
//# sourceMappingURL=earnings-cashout.service.js.map