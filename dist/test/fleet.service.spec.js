"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fleet_service_1 = require("../src/fleet/fleet.service");
const in_memory_store_service_1 = require("../src/storage/in-memory-store.service");
describe('FleetService', () => {
    it('creates fleet-managed drivers', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new fleet_service_1.FleetService(store);
        const branchId = store.fleetBranches[0]?.id;
        const created = service.createDriver('fleet-demo-001', {
            fullName: 'New Fleet Driver',
            email: 'new-driver@example.com',
            phone: '+256700123456',
            branchId,
            serviceModes: ['ride', 'delivery'],
        });
        expect(created.fleetId).toBe('fleet-demo-001');
        expect(service.listDrivers('fleet-demo-001').some((item) => item.driverId === created.driverId)).toBe(true);
    });
    it('creates fleet dispatches with trips and job offers', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new fleet_service_1.FleetService(store);
        const fleetDriver = service.listDrivers('fleet-demo-001')[0];
        const fleetVehicle = store.vehicles.find((item) => item.fleetId === 'fleet-demo-001');
        const result = service.createDispatch('fleet-demo-001', {
            driverId: fleetDriver.driverId,
            vehicleId: fleetVehicle?.id,
            pickup: 'Nakasero',
            dropoff: 'Entebbe',
            type: 'ride',
        });
        expect(result.dispatch.fleetId).toBe('fleet-demo-001');
        expect(result.trip.fleetId).toBe('fleet-demo-001');
        expect(store.jobs.some((item) => item.tripId === result.trip.id)).toBe(true);
    });
    it('aggregates fleet earnings from managed drivers', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new fleet_service_1.FleetService(store);
        const summary = service.getEarningsSummary('fleet-demo-001', 'month');
        expect(summary.total).toBeGreaterThan(0);
        expect(summary.count).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=fleet.service.spec.js.map