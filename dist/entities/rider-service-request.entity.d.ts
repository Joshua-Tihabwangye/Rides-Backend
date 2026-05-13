export declare class RiderServiceRequest {
    id: string;
    riderId: string;
    driverId: string;
    serviceType: 'rental' | 'tour' | 'ambulance';
    status: string;
    payload: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
