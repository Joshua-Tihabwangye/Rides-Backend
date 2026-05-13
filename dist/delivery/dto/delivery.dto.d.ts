export declare class CreateDeliveryOrderDto {
    pickupAddress: string;
    dropoffAddress: string;
    pickupLat?: number;
    pickupLng?: number;
    dropoffLat?: number;
    dropoffLng?: number;
    itemDescription?: string;
    routeSummary?: string;
}
export declare class VerifyDeliveryQrDto {
    qrValue: string;
    scanType?: string;
}
export declare class PatchRiderDeliveryDto {
    status?: 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'failed';
}
export declare class CancelRiderDeliveryDto {
    reason?: string;
}
