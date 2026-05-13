export declare class EarningsLedger {
    id: string;
    userId: string;
    driverId: string;
    type: string;
    amount: number;
    tripId: string;
    deliveryOrderId: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
