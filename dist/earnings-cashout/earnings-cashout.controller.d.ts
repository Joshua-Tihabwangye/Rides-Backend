import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { CashoutRequestDto, EarningsSummaryQueryDto } from './dto/earnings.dto';
import { EarningsCashoutService } from './earnings-cashout.service';
export declare class EarningsCashoutController {
    private readonly earningsService;
    private readonly apiResponse;
    constructor(earningsService: EarningsCashoutService, apiResponse: ApiResponseService);
    getSummary(user: AuthenticatedUser, query: EarningsSummaryQueryDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        period: "day" | "week" | "month" | "quarter" | "year";
        total: number;
        currency: string;
        count: number;
    }>>;
    getEvents(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/earnings-ledger.entity").EarningsLedger[]>>;
    getWalletEventsCompat(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/earnings-ledger.entity").EarningsLedger[]>>;
    getWallet(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/wallet-account.entity").WalletAccount | {
        driverId: string;
        currency: string;
        balance: number;
    }>>;
    getCashoutMethods(user: AuthenticatedUser, req: Request): import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        label: string;
        minAmount: number;
    }[]>;
    postCashoutRequest(user: AuthenticatedUser, body: CashoutRequestDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/cashout-request.entity").CashoutRequest>>;
    postWalletCashoutCompat(user: AuthenticatedUser, body: CashoutRequestDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/cashout-request.entity").CashoutRequest>>;
    listCashoutRequests(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/cashout-request.entity").CashoutRequest[]>>;
    listWalletCashoutsCompat(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/cashout-request.entity").CashoutRequest[]>>;
}
