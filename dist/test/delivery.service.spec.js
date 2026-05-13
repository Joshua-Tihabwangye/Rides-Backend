"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delivery_service_1 = require("../src/delivery/delivery.service");
const in_memory_store_service_1 = require("../src/storage/in-memory-store.service");
describe('DeliveryService', () => {
    it('creates rider delivery orders', async () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new delivery_service_1.DeliveryService(store);
        const result = await service.createOrder('rider-demo-001', {
            pickupAddress: 'Kisementi',
            dropoffAddress: 'Bukoto',
        });
        expect(result.order.riderId).toBe('rider-demo-001');
        expect(result.route.orderId).toBe(result.order.id);
    });
    it('requires pickup_confirmed before qr verify', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new delivery_service_1.DeliveryService(store);
        expect(() => service.qrVerify('driver-demo-001', 'route-delivery-001', 'abc')).toThrow();
    });
    it('requires all stops completed before dropoff complete', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new delivery_service_1.DeliveryService(store);
        service.pickupConfirm('driver-demo-001', 'route-delivery-001');
        service.qrVerify('driver-demo-001', 'route-delivery-001', 'qr-123');
        service.startRoute('driver-demo-001', 'route-delivery-001');
        expect(() => service.dropoffComplete('driver-demo-001', 'route-delivery-001')).toThrow();
    });
});
//# sourceMappingURL=delivery.service.spec.js.map