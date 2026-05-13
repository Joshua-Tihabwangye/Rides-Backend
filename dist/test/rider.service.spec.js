"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_profile_service_1 = require("../src/driver-profile/driver-profile.service");
const presence_location_service_1 = require("../src/presence-location/presence-location.service");
const rider_service_1 = require("../src/rider/rider.service");
const in_memory_store_service_1 = require("../src/storage/in-memory-store.service");
describe('RiderService', () => {
    it('creates trip requests and nearby driver job offers', async () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const driverProfileService = new driver_profile_service_1.DriverProfileService(store);
        const presenceLocationService = new presence_location_service_1.PresenceLocationService(store, driverProfileService);
        const service = new rider_service_1.RiderService(store, presenceLocationService);
        store.driverPresence.set('driver-demo-001', 'online');
        store.driverLocations.set('driver-demo-001', {
            driverId: 'driver-demo-001',
            latitude: 0.3368,
            longitude: 32.5825,
            timestamp: Date.now(),
        });
        const result = await service.requestTrip('rider-demo-001', {
            pickupAddress: 'Kololo',
            pickupLat: 0.3363,
            pickupLng: 32.5822,
            dropoffAddress: 'Ntinda',
            dropoffLat: 0.3476,
            dropoffLng: 32.6126,
            radiusMeters: 5000,
        });
        expect(result.trip.status).toBe('requested');
        expect(result.jobOffers).toHaveLength(1);
        expect(result.jobOffers[0].driverId).toBe('driver-demo-001');
    });
});
//# sourceMappingURL=rider.service.spec.js.map