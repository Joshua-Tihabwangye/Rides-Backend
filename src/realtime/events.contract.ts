/**
 * Normalized Realtime Event Contracts
 * Defines standardized event names and payloads per namespace
 * Ensures consistency between backend and frontend consumers
 */

/**
 * Driver Namespace Events (/driver)
 * Events sent from driver app to backend (client -> server)
 * Events broadcast from backend to driver app (server -> client)
 */
export const DriverEvents = {
  // Client -> Server (driver sends these to backend)
  CLIENT: {
    LOCATION_UPDATE: 'location.update',
    JOB_OFFER_RESPONSE: 'job.offer.response',
    TRIP_ACK: 'trip.ack',
    SUBSCRIBE: 'subscribe',
  } as const,

  // Server -> Client (backend broadcasts these to driver)
  SERVER: {
    TRIP_LOCATION_UPDATED: 'trip.location.updated',
    JOB_OFFER_UPDATED: 'job.offer.updated',
    TRIP_ACK_RECEIVED: 'trip.ack.received',
    SUBSCRIBED: 'subscribed',
    // Additional standardized events for driver
    TRIP_STATE_CHANGED: 'trip.state.changed',
    JOB_OFFERED: 'job.offered',
    JOB_EXPIRED: 'job.expired',
    SAFETY_ALERT: 'safety.alert',
    COMPLIANCE_UPDATE: 'compliance.update',
  } as const,
} as const;

/**
 * Rider Namespace Events (/rider)
 * Events sent from rider app to backend
 * Events broadcast from backend to rider app
 */
export const RiderEvents = {
  // Client -> Server
  CLIENT: {
    TRIP_REQUEST: 'trip.request',
    TRIP_CANCEL: 'trip.cancel',
    TRIP_RATE: 'trip.rate',
    PAYMENT_UPDATE: 'payment.update',
    SUBSCRIBE: 'subscribe',
  } as const,

  // Server -> Client
  SERVER: {
    TRIP_OFFERED: 'trip.offered',
    TRIP_REQUEST_ACCEPTED: 'trip.request.accepted',
    TRIP_REQUEST_EXPIRED: 'trip.request.expired',
    TRIP_STATE_CHANGED: 'trip.state.changed',
    TRIP_DRIVER_ASSIGNED: 'trip.driver.assigned',
    TRIP_DRIVER_ARRIVED: 'trip.driver.arrived',
    TRIP_STARTED: 'trip.started',
    TRIP_COMPLETED: 'trip.completed',
    TRIP_CANCELLED: 'trip.cancelled',
    RENTAL_UPDATED: 'rental.updated',
    TOUR_UPDATED: 'tour.updated',
    AMBULANCE_UPDATED: 'ambulance.updated',
    RIDER_SERVICE_UPDATED: 'rider.service.updated',
    PAYMENT_REQUIRED: 'payment.required',
    PAYMENT_CONFIRMED: 'payment.confirmed',
    PAYMENT_FAILED: 'payment.failed',
    SUBSCRIBED: 'subscribed',
  } as const,
} as const;

/**
 * Fleet Namespace Events (/fleet)
 * Events sent from fleet app to backend
 * Events broadcast from backend to fleet app
 */
export const FleetEvents = {
  // Client -> Server
  CLIENT: {
    VEHICLE_UPDATE: 'vehicle.update',
    DRIVER_ASSIGN: 'driver.assign',
    DISPATCH_CREATE: 'dispatch.create',
    DISPATCH_UPDATE: 'dispatch.update',
    SUBSCRIBE: 'subscribe',
  } as const,

  // Server -> Client
  SERVER: {
    DISPATCH_CREATED: 'dispatch.created',
    DISPATCH_UPDATED: 'dispatch.updated',
    DISPATCH_COMPLETED: 'dispatch.completed',
    VEHICLE_LOCATION_UPDATED: 'vehicle.location.updated',
    VEHICLE_STATUS_CHANGED: 'vehicle.status.changed',
    DRIVER_ASSIGNED: 'driver.assigned',
    DRIVER_UNASSIGNED: 'driver.unassigned',
    FLEET_ALERT: 'fleet.alert',
    SUBSCRIBED: 'subscribed',
  } as const,
} as const;

/**
 * Admin Namespace Events (/admin)
 * Events sent from admin app to backend
 * Events broadcast from backend to admin app
 */
export const AdminEvents = {
  // Client -> Server
  CLIENT: {
    FLAG_UPDATE: 'flag.update',
    COMPLIANCE_REVIEW: 'compliance.review',
    APPROVAL_ACTION: 'approval.action',
    SUBSCRIBE: 'subscribe',
  } as const,

  // Server -> Client
  SERVER: {
    FLAG_CHANGED: 'flag.changed',
    FLAG_CREATED: 'flag.created',
    FLAG_DELETED: 'flag.deleted',
    COMPLIANCE_EVENT: 'compliance.event',
    APPROVAL_CREATED: 'approval.created',
    APPROVAL_UPDATED: 'approval.updated',
    APPROVAL_REVIEWED: 'approval.reviewed',
    SYSTEM_ALERT: 'system.alert',
    AUDIT_LOG_ENTRY: 'audit.log.entry',
    SUBSCRIBED: 'subscribed',
  } as const,
} as const;

/**
 * Type definitions for event payloads
 */

/** Driver Events Payloads */
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
    pickupLocation: { lat: number; lng: number };
    dropoffLocation: { lat: number; lng: number };
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
    location?: { lat: number; lng: number };
  };
  [DriverEvents.SERVER.COMPLIANCE_UPDATE]: {
    driverId: string;
    documentType: 'license' | 'insurance' | 'registration' | 'medical';
    status: 'valid' | 'expiring_soon' | 'expired' | 'missing';
    expiresAt?: number;
  };
};

/** Rider Events Payloads */
export type RiderEventPayloads = {
  [RiderEvents.CLIENT.TRIP_REQUEST]: {
    pickup: { lat: number; lng: number; address?: string };
    dropoff: { lat: number; lng: number; address?: string };
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
    rating: number; // 1-5
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
    pickup: { lat: number; lng: number; address?: string };
    dropoff: { lat: number; lng: number; address?: string };
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
    eta: number; // minutes
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
    distance: number; // km
    duration: number; // minutes
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

/** Fleet Events Payloads */
export type FleetEventPayloads = {
  [FleetEvents.CLIENT.VEHICLE_UPDATE]: {
    vehicleId: string;
    location?: { lat: number; lng: number };
    status?: 'available' | 'offline' | 'maintenance' | 'charging';
    soc?: number; // state of charge %
  };
  [FleetEvents.CLIENT.DRIVER_ASSIGN]: {
    vehicleId: string;
    driverId: string;
  };
  [FleetEvents.CLIENT.DISPATCH_CREATE]: {
    vehicleIds: string[];
    driverIds: string[];
    destination: { lat: number; lng: number; address?: string };
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
    destination: { lat: number; lng: number; address?: string };
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

/** Admin Events Payloads */
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
    changedBy: string; // admin userId
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
    changes?: Record<string, { old: any; new: any }>;
  };
};

/**
 * Helper Types
 */
export type TripStatus =
  | 'requested'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type VehicleStatus = 'available' | 'offline' | 'maintenance' | 'charging';

type ValueOf<T> = T[keyof T];

/**
 * Union type for all possible events (for typing gateway handlers)
 */
export type AllServerEvents =
  | ValueOf<typeof DriverEvents.SERVER>
  | ValueOf<typeof RiderEvents.SERVER>
  | ValueOf<typeof FleetEvents.SERVER>
  | ValueOf<typeof AdminEvents.SERVER>;

export type AllClientEvents =
  | ValueOf<typeof DriverEvents.CLIENT>
  | ValueOf<typeof RiderEvents.CLIENT>
  | ValueOf<typeof FleetEvents.CLIENT>
  | ValueOf<typeof AdminEvents.CLIENT>;
