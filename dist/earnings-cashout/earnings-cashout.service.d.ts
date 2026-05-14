import { PrismaService } from '../prisma/prisma.service';
export declare class EarningsCashoutService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSummary(driverId: string, period?: 'day' | 'week' | 'month' | 'quarter' | 'year'): Promise<{
        period: "day" | "week" | "month" | "quarter" | "year";
        total: number;
        currency: string;
        count: number;
    }>;
    getEvents(driverId: string): Promise<{
        type: import(".prisma/client").$Enums.EarningsType;
        id: string;
        driverId: string | null;
        createdAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        tripId: string | null;
        deliveryOrderId: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    getWallet(driverId: string): Promise<{
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
    }>;
    getCashoutMethods(_driverId: string): {
        id: string;
        label: string;
        minAmount: number;
    }[];
    createCashoutRequest(driverId: string, input: {
        methodId: string;
        amount: number;
    }): Promise<{
        status: import(".prisma/client").$Enums.CashoutStatus;
        id: string;
        driverId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        method: import("@prisma/client/runtime/client").JsonValue;
    }>;
    listCashoutRequests(driverId: string): Promise<{
        status: import(".prisma/client").$Enums.CashoutStatus;
        id: string;
        driverId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        method: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    private periodThresholdDate;
}
