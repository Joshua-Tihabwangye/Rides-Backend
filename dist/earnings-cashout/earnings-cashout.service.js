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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningsCashoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EarningsCashoutService = class EarningsCashoutService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(driverId, period = 'week') {
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
    async getEvents(driverId) {
        return this.prisma.earningsLedger.findMany({
            where: { driverId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getWallet(driverId) {
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
    getCashoutMethods(_driverId) {
        return [
            { id: 'mobile-money', label: 'Mobile Money', minAmount: 5000 },
            { id: 'bank-transfer', label: 'Bank Transfer', minAmount: 20000 },
        ];
    }
    async createCashoutRequest(driverId, input) {
        const wallet = await this.prisma.walletAccount.findFirst({ where: { driverId } });
        if (!wallet) {
            throw new common_1.BadRequestException('Wallet not found');
        }
        if (input.amount > Number(wallet.balance)) {
            throw new common_1.BadRequestException('Insufficient wallet balance');
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
    async listCashoutRequests(driverId) {
        return this.prisma.cashoutRequest.findMany({
            where: { driverId },
            orderBy: { createdAt: 'desc' },
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EarningsCashoutService);
//# sourceMappingURL=earnings-cashout.service.js.map