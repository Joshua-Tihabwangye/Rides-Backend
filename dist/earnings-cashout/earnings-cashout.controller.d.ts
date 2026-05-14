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
    getEvents(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.EarningsType;
        id: string;
        driverId: string | null;
        createdAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        tripId: string | null;
        deliveryOrderId: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>>;
    getWalletEventsCompat(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.EarningsType;
        id: string;
        driverId: string | null;
        createdAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        tripId: string | null;
        deliveryOrderId: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>>;
    getWallet(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        driverId: string | null;
        updatedAt: Date;
        userId: string;
        currency: string;
        balance: import("@prisma/client-runtime-utils").Decimal;
        settings: import("@prisma/client/runtime/client").JsonValue;
    } | {
        driverId: string;
        currency: string;
        balance: number;
    }>>;
    getCashoutMethods(user: AuthenticatedUser, req: Request): import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        label: string;
        minAmount: number;
    }[]>;
    postCashoutRequest(user: AuthenticatedUser, body: CashoutRequestDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.CashoutStatus;
        id: string;
        driverId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        method: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    postWalletCashoutCompat(user: AuthenticatedUser, body: CashoutRequestDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.CashoutStatus;
        id: string;
        driverId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        method: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    listCashoutRequests(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.CashoutStatus;
        id: string;
        driverId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        method: import("@prisma/client/runtime/client").JsonValue;
    }[]>>;
    listWalletCashoutsCompat(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.CashoutStatus;
        id: string;
        driverId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        method: import("@prisma/client/runtime/client").JsonValue;
    }[]>>;
}
