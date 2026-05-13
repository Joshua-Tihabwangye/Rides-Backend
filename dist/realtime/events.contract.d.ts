export declare const DriverEvents: {
    readonly CLIENT: {
        readonly LOCATION_UPDATE: "location.update";
        readonly JOB_OFFER_RESPONSE: "job.offer.response";
        readonly TRIP_ACK: "trip.ack";
        readonly SUBSCRIBE: "subscribe";
    };
    readonly SERVER: {
        readonly TRIP_LOCATION_UPDATED: "trip.location.updated";
        readonly JOB_OFFER_UPDATED: "job.offer.updated";
        readonly TRIP_ACK_RECEIVED: "trip.ack.received";
        readonly SUBSCRIBED: "subscribed";
        readonly TRIP_STATE_CHANGED: "trip.state.changed";
        readonly JOB_OFFERED: "job.offered";
        readonly JOB_EXPIRED: "job.expired";
        readonly SAFETY_ALERT: "safety.alert";
        readonly COMPLIANCE_UPDATE: "compliance.update";
    };
};
export declare const RiderEvents: {
    readonly CLIENT: {
        readonly TRIP_REQUEST: "trip.request";
        readonly TRIP_CANCEL: "trip.cancel";
        readonly TRIP_RATE: "trip.rate";
        readonly PAYMENT_UPDATE: "payment.update";
        readonly SUBSCRIBE: "subscribe";
    };
    readonly SERVER: {
        readonly TRIP_OFFERED: "trip.offered";
        readonly TRIP_REQUEST_ACCEPTED: "trip.request.accepted";
        readonly TRIP_REQUEST_EXPIRED: "trip.request.expired";
        readonly TRIP_STATE_CHANGED: "trip.state.changed";
        readonly TRIP_DRIVER_ASSIGNED: "trip.driver.assigned";
        readonly TRIP_DRIVER_ARRIVED: "trip.driver.arrived";
        readonly TRIP_STARTED: "trip.started";
        readonly TRIP_COMPLETED: "trip.completed";
        readonly TRIP_CANCELLED: "trip.cancelled";
        readonly RENTAL_UPDATED: "rental.updated";
        readonly TOUR_UPDATED: "tour.updated";
        readonly AMBULANCE_UPDATED: "ambulance.updated";
        readonly RIDER_SERVICE_UPDATED: "rider.service.updated";
        readonly PAYMENT_REQUIRED: "payment.required";
        readonly PAYMENT_CONFIRMED: "payment.confirmed";
        readonly PAYMENT_FAILED: "payment.failed";
        readonly SUBSCRIBED: "subscribed";
    };
};
export declare const FleetEvents: {
    readonly CLIENT: {
        readonly VEHICLE_UPDATE: "vehicle.update";
        readonly DRIVER_ASSIGN: "driver.assign";
        readonly DISPATCH_CREATE: "dispatch.create";
        readonly DISPATCH_UPDATE: "dispatch.update";
        readonly SUBSCRIBE: "subscribe";
    };
    readonly SERVER: {
        readonly DISPATCH_CREATED: "dispatch.created";
        readonly DISPATCH_UPDATED: "dispatch.updated";
        readonly DISPATCH_COMPLETED: "dispatch.completed";
        readonly VEHICLE_LOCATION_UPDATED: "vehicle.location.updated";
        readonly VEHICLE_STATUS_CHANGED: "vehicle.status.changed";
        readonly DRIVER_ASSIGNED: "driver.assigned";
        readonly DRIVER_UNASSIGNED: "driver.unassigned";
        readonly FLEET_ALERT: "fleet.alert";
        readonly SUBSCRIBED: "subscribed";
    };
};
export declare const AdminEvents: {
    readonly CLIENT: {
        readonly FLAG_UPDATE: "flag.update";
        readonly COMPLIANCE_REVIEW: "compliance.review";
        readonly APPROVAL_ACTION: "approval.action";
        readonly SUBSCRIBE: "subscribe";
    };
    readonly SERVER: {
        readonly FLAG_CHANGED: "flag.changed";
        readonly FLAG_CREATED: "flag.created";
        readonly FLAG_DELETED: "flag.deleted";
        readonly COMPLIANCE_EVENT: "compliance.event";
        readonly APPROVAL_CREATED: "approval.created";
        readonly APPROVAL_UPDATED: "approval.updated";
        readonly APPROVAL_REVIEWED: "approval.reviewed";
        readonly SYSTEM_ALERT: "system.alert";
        readonly AUDIT_LOG_ENTRY: "audit.log.entry";
        readonly SUBSCRIBED: "subscribed";
    };
};
export type DriverEventPayloads = {
    [DriverEvents.CLIENT.LOCATION_UPDATE]: {
        tripId?: string;
        latitude: number;
        longitude: number;
        timestamp?: number;
        accuracy?: number;
        speed?: number;
        heading?: number;
    };
    [DriverEvents.CLIENT.JOB_OFFER_RESPONSE]: {
        jobId: string;
        action: 'accept' | 'reject';
        notes?: string;
    };
    [DriverEvents.CLIENT.TRIP_ACK]: {
        tripId: string;
        event: string;
    };
    [DriverEvents.SERVER.TRIP_LOCATION_UPDATED]: {
        driverId: string;
        tripId?: string;
        latitude: number;
        longitude: number;
        timestamp: number;
        accuracy?: number;
        speed?: number;
        heading?: number;
    };
    [DriverEvents.SERVER.JOB_OFFER_UPDATED]: {
        jobId: string;
        action: 'accept' | 'reject';
        driverId: string;
        tripId?: string;
        timestamp: number;
    };
    [DriverEvents.SERVER.JOB_OFFERED]: {
        jobId: string;
        tripId: string;
        driverId: string;
        pickupLocation: {
            lat: number;
            lng: number;
        };
        dropoffLocation: {
            lat: number;
            lng: number;
        };
        fareEstimate: number;
        expiresAt: number;
    };
    [DriverEvents.SERVER.TRIP_STATE_CHANGED]: {
        tripId: string;
        driverId: string;
        oldStatus: TripStatus;
        newStatus: TripStatus;
        timestamp: number;
    };
    [DriverEvents.SERVER.SAFETY_ALERT]: {
        tripId: string;
        driverId: string;
        alertType: 'emergency_stop' | 'route_deviation' | 'excessive_speed' | 'hard_braking';
        description: string;
        timestamp: number;
        location?: {
            lat: number;
            lng: number;
        };
    };
    [DriverEvents.SERVER.COMPLIANCE_UPDATE]: {
        driverId: string;
        documentType: 'license' | 'insurance' | 'registration' | 'medical';
        status: 'valid' | 'expiring_soon' | 'expired' | 'missing';
        expiresAt?: number;
    };
};
export type RiderEventPayloads = {
    [RiderEvents.CLIENT.TRIP_REQUEST]: {
        pickup: {
            lat: number;
            lng: number;
            address?: string;
        };
        dropoff: {
            lat: number;
            lng: number;
            address?: string;
        };
        type?: 'ride' | 'delivery' | 'rental' | 'tour' | 'ambulance' | 'school';
        scheduledAt?: number;
        notes?: string;
    };
    [RiderEvents.CLIENT.TRIP_CANCEL]: {
        tripId: string;
        reason: string;
        details?: string;
        cancelledBy: 'rider' | 'driver' | 'system';
    };
    [RiderEvents.CLIENT.TRIP_RATE]: {
        tripId: string;
        rating: number;
        review?: string;
    };
    [RiderEvents.CLIENT.PAYMENT_UPDATE]: {
        tripId: string;
        paymentMethodId?: string;
        amount?: number;
    };
    [RiderEvents.SERVER.TRIP_OFFERED]: {
        tripId: string;
        riderId: string;
        pickup: {
            lat: number;
            lng: number;
            address?: string;
        };
        dropoff: {
            lat: number;
            lng: number;
            address?: string;
        };
        fareEstimate: number;
        vehicleType?: string;
        expiresAt: number;
    };
    [RiderEvents.SERVER.TRIP_REQUEST_ACCEPTED]: {
        tripId: string;
        driverId: string;
        driverName: string;
        driverRating: number;
        vehicleModel: string;
        vehiclePlate: string;
        eta: number;
    };
    [RiderEvents.SERVER.TRIP_STATE_CHANGED]: {
        tripId: string;
        riderId: string;
        oldStatus: TripStatus;
        newStatus: TripStatus;
        timestamp: number;
    };
    [RiderEvents.SERVER.TRIP_DRIVER_ASSIGNED]: {
        tripId: string;
        driverId: string;
        driverName: string;
        driverRating: number;
        vehicleModel: string;
        vehiclePlate: string;
    };
    [RiderEvents.SERVER.TRIP_DRIVER_ARRIVED]: {
        tripId: string;
        driverId: string;
        arrivalTime: number;
    };
    [RiderEvents.SERVER.TRIP_STARTED]: {
        tripId: string;
        startTime: number;
        initialFare: number;
    };
    [RiderEvents.SERVER.TRIP_COMPLETED]: {
        tripId: string;
        endTime: number;
        totalFare: number;
        distance: number;
        duration: number;
    };
    [RiderEvents.SERVER.TRIP_CANCELLED]: {
        tripId: string;
        cancelledBy: 'rider' | 'driver' | 'system';
        reason: string;
        refundAmount?: number;
        cancellationTime: number;
    };
    [RiderEvents.SERVER.PAYMENT_REQUIRED]: {
        tripId: string;
        amount: number;
        currency: string;
        dueAt: number;
    };
    [RiderEvents.SERVER.PAYMENT_CONFIRMED]: {
        tripId: string;
        paymentId: string;
        amount: number;
        timestamp: number;
        method: string;
    };
    [RiderEvents.SERVER.PAYMENT_FAILED]: {
        tripId: string;
        error: string;
        retryAllowed: boolean;
    };
};
export type FleetEventPayloads = {
    [FleetEvents.CLIENT.VEHICLE_UPDATE]: {
        vehicleId: string;
        location?: {
            lat: number;
            lng: number;
        };
        status?: 'available' | 'offline' | 'maintenance' | 'charging';
        soc?: number;
    };
    [FleetEvents.CLIENT.DRIVER_ASSIGN]: {
        vehicleId: string;
        driverId: string;
    };
    [FleetEvents.CLIENT.DISPATCH_CREATE]: {
        vehicleIds: string[];
        driverIds: string[];
        destination: {
            lat: number;
            lng: number;
            address?: string;
        };
        notes?: string;
    };
    [FleetEvents.CLIENT.DISPATCH_UPDATE]: {
        dispatchId: string;
        vehicleIds?: string[];
        status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    };
    [FleetEvents.SERVER.DISPATCH_CREATED]: {
        dispatchId: string;
        vehicleIds: string[];
        driverIds: string[];
        destination: {
            lat: number;
            lng: number;
            address?: string;
        };
        createdAt: number;
    };
    [FleetEvents.SERVER.DISPATCH_UPDATED]: {
        dispatchId: string;
        vehicleIds: string[];
        driverIds: string[];
        status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
        updatedAt: number;
    };
    [FleetEvents.SERVER.DISPATCH_COMPLETED]: {
        dispatchId: string;
        completedAt: number;
        vehicleCount: number;
        driverCount: number;
    };
    [FleetEvents.SERVER.VEHICLE_LOCATION_UPDATED]: {
        vehicleId: string;
        latitude: number;
        longitude: number;
        timestamp: number;
        soc?: number;
        status: 'available' | 'offline' | 'maintenance' | 'charging';
    };
    [FleetEvents.SERVER.VEHICLE_STATUS_CHANGED]: {
        vehicleId: string;
        oldStatus: VehicleStatus;
        newStatus: VehicleStatus;
        timestamp: number;
    };
    [FleetEvents.SERVER.DRIVER_ASSIGNED]: {
        vehicleId: string;
        driverId: string;
        assignedAt: number;
    };
    [FleetEvents.SERVER.DRIVER_UNASSIGNED]: {
        vehicleId: string;
        driverId: string;
        unassignedAt: number;
    };
    [FleetEvents.SERVER.FLEET_ALERT]: {
        type: 'low_battery' | 'maintenance_due' | 'offline_too_long' | 'incident';
        vehicleId?: string;
        driverId?: string;
        description: string;
        timestamp: number;
    };
};
export type AdminEventPayloads = {
    [AdminEvents.CLIENT.FLAG_UPDATE]: {
        flagId: string;
        enabled: boolean;
        value?: string | number | boolean;
    };
    [AdminEvents.CLIENT.COMPLIANCE_REVIEW]: {
        complianceId: string;
        action: 'approve' | 'reject';
        notes?: string;
    };
    [AdminEvents.CLIENT.APPROVAL_ACTION]: {
        approvalId: string;
        action: 'approve' | 'reject' | 'request_changes';
        notes?: string;
    };
    [AdminEvents.SERVER.FLAG_CHANGED]: {
        flagId: string;
        enabled: boolean;
        value?: string | number | boolean;
        changedBy: string;
        timestamp: number;
    };
    [AdminEvents.SERVER.FLAG_CREATED]: {
        flagId: string;
        key: string;
        enabled: boolean;
        value?: string | number | boolean;
        createdBy: string;
        timestamp: number;
    };
    [AdminEvents.SERVER.FLAG_DELETED]: {
        flagId: string;
        deletedBy: string;
        timestamp: number;
    };
    [AdminEvents.SERVER.COMPLIANCE_EVENT]: {
        complianceId: string;
        entityType: 'driver' | 'vehicle' | 'fleet' | 'company';
        entityId: string;
        status: 'compliant' | 'non_compliant' | 'under_review';
        timestamp: number;
    };
    [AdminEvents.SERVER.APPROVAL_CREATED]: {
        approvalId: string;
        entityType: 'driver' | 'vehicle' | 'fleet' | 'company' | 'promo' | 'pricing';
        entityId: string;
        requestedBy: string;
        createdAt: number;
    };
    [AdminEvents.SERVER.APPROVAL_UPDATED]: {
        approvalId: string;
        entityType: 'driver' | 'vehicle' | 'fleet' | 'company' | 'promo' | 'pricing';
        entityId: string;
        updatedBy: string;
        updatedAt: number;
    };
    [AdminEvents.SERVER.APPROVAL_REVIEWED]: {
        approvalId: string;
        decision: 'approved' | 'rejected' | 'changes_requested';
        reviewedBy: string;
        reviewedAt: number;
    };
    [AdminEvents.SERVER.SYSTEM_ALERT]: {
        alertType: 'maintenance' | 'security' | 'performance' | 'update';
        message: string;
        severity: 'info' | 'warning' | 'critical';
        timestamp: number;
    };
    [AdminEvents.SERVER.AUDIT_LOG_ENTRY]: {
        auditId: string;
        userId: string;
        action: string;
        entityType: string;
        entityId?: string;
        timestamp: number;
        changes?: Record<string, {
            old: any;
            new: any;
        }>;
    };
};
export type TripStatus = 'requested' | 'driver_assigned' | 'driver_arriving' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
export type VehicleStatus = 'available' | 'offline' | 'maintenance' | 'charging';
type ValueOf<T> = T[keyof T];
export type AllServerEvents = ValueOf<typeof DriverEvents.SERVER> | ValueOf<typeof RiderEvents.SERVER> | ValueOf<typeof FleetEvents.SERVER> | ValueOf<typeof AdminEvents.SERVER>;
export type AllClientEvents = ValueOf<typeof DriverEvents.CLIENT> | ValueOf<typeof RiderEvents.CLIENT> | ValueOf<typeof FleetEvents.CLIENT> | ValueOf<typeof AdminEvents.CLIENT>;
export {};
