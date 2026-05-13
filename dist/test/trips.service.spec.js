"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trips_service_1 = require("../src/trips/trips.service");
const in_memory_store_service_1 = require("../src/storage/in-memory-store.service");
describe('TripsService', () => {
    it('enforces state transitions', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new trips_service_1.TripsService(store);
        const trip = {
            id: 'trip-test-001',
            riderId: 'rider-demo-001',
            driverId: 'driver-demo-001',
            jobId: 'job-test-001',
            type: 'ride',
            status: 'driver_assigned',
            pickup: 'Kololo',
            dropoff: 'Ntinda',
            pickupLocation: { lat: 0.3363, lng: 32.5822 },
            dropoffLocation: { lat: 0.3476, lng: 32.6126 },
            otpCode: '1234',
            requestedAt: Date.now(),
            updatedAt: Date.now(),
        };
        store.trips.push(trip);
        expect(() => service.complete('driver-demo-001', trip.id)).toThrow();
    });
    it('completes standard trip flow', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new trips_service_1.TripsService(store);
        const trip = {
            id: 'trip-test-002',
            riderId: 'rider-demo-001',
            type: 'ride',
            status: 'requested',
            pickup: 'Kololo',
            dropoff: 'Ntinda',
            pickupLocation: { lat: 0.3363, lng: 32.5822 },
            dropoffLocation: { lat: 0.3476, lng: 32.6126 },
            otpCode: '4567',
            requestedAt: Date.now(),
            updatedAt: Date.now(),
        };
        store.trips.push(trip);
        service.assignDriver('driver-demo-001', trip.id, 'job-test-002');
        service.markEnRoute('driver-demo-001', trip.id);
        service.arrive('driver-demo-001', trip.id);
        service.verifyRider('driver-demo-001', trip.id, trip.otpCode);
        service.start('driver-demo-001', trip.id);
        const completed = service.complete('driver-demo-001', trip.id);
        expect(completed.status).toBe('completed');
    });
});
//# sourceMappingURL=trips.service.spec.js.map