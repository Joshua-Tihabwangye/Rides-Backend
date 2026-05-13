"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEvents = exports.FleetEvents = exports.RiderEvents = exports.DriverEvents = void 0;
exports.DriverEvents = {
    CLIENT: {
        LOCATION_UPDATE: 'location.update',
        JOB_OFFER_RESPONSE: 'job.offer.response',
        TRIP_ACK: 'trip.ack',
        SUBSCRIBE: 'subscribe',
    },
    SERVER: {
        TRIP_LOCATION_UPDATED: 'trip.location.updated',
        JOB_OFFER_UPDATED: 'job.offer.updated',
        TRIP_ACK_RECEIVED: 'trip.ack.received',
        SUBSCRIBED: 'subscribed',
        TRIP_STATE_CHANGED: 'trip.state.changed',
        JOB_OFFERED: 'job.offered',
        JOB_EXPIRED: 'job.expired',
        SAFETY_ALERT: 'safety.alert',
        COMPLIANCE_UPDATE: 'compliance.update',
    },
};
exports.RiderEvents = {
    CLIENT: {
        TRIP_REQUEST: 'trip.request',
        TRIP_CANCEL: 'trip.cancel',
        TRIP_RATE: 'trip.rate',
        PAYMENT_UPDATE: 'payment.update',
        SUBSCRIBE: 'subscribe',
    },
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
    },
};
exports.FleetEvents = {
    CLIENT: {
        VEHICLE_UPDATE: 'vehicle.update',
        DRIVER_ASSIGN: 'driver.assign',
        DISPATCH_CREATE: 'dispatch.create',
        DISPATCH_UPDATE: 'dispatch.update',
        SUBSCRIBE: 'subscribe',
    },
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
    },
};
exports.AdminEvents = {
    CLIENT: {
        FLAG_UPDATE: 'flag.update',
        COMPLIANCE_REVIEW: 'compliance.review',
        APPROVAL_ACTION: 'approval.action',
        SUBSCRIBE: 'subscribe',
    },
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
    },
};
//# sourceMappingURL=events.contract.js.map