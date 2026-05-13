export declare class DeliveryOrder {
    id: string;
    riderId: string;
    driverId: string;
    routeId: string;
    status: string;
    pickup: Record<string, any>;
    dropoff: Record<string, any>;
    items: Record<string, any>[];
    fare: number;
    qrCode: string;
    createdAt: Date;
    updatedAt: Date;
}
