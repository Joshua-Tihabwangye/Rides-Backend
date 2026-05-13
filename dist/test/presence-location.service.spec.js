"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_profile_service_1 = require("../src/driver-profile/driver-profile.service");
const presence_location_service_1 = require("../src/presence-location/presence-location.service");
const in_memory_store_service_1 = require("../src/storage/in-memory-store.service");
describe('PresenceLocationService', () => {
    it('returns only nearby online drivers', async () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const driverProfileService = new driver_profile_service_1.DriverProfileService(store);
        const service = new presence_location_service_1.PresenceLocationService(store, driverProfileService);
        store.driverPresence.set('driver-demo-001', 'online');
        store.driverLocations.set('driver-demo-001', {
            driverId: 'driver-demo-001',
            latitude: 0.3368,
            longitude: 32.5825,
            timestamp: Date.now(),
        });
        const nearby = await service.findNearbyDrivers(0.3363, 32.5822, 1000);
        expect(nearby).toHaveLength(1);
        expect(nearby[0].driverId).toBe('driver-demo-001');
    });
});
//# sourceMappingURL=presence-location.service.spec.js.map