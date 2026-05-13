export declare class JobOffer {
    id: string;
    tripId: string;
    driverId: string;
    riderId: string;
    status: string;
    type: string;
    pickup: string;
    dropoff: string;
    pickupLocation: {
        lat: number;
        lng: number;
    };
    dropoffLocation: {
        lat: number;
        lng: number;
    };
    estimatedFare: number;
    route: Record<string, any>;
    expiresAt: Date;
    respondedAt: Date;
    createdAt: Date;
}
