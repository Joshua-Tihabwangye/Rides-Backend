"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const earnings_cashout_service_1 = require("../src/earnings-cashout/earnings-cashout.service");
const in_memory_store_service_1 = require("../src/storage/in-memory-store.service");
describe('EarningsCashoutService', () => {
    it('rejects cashout over available balance', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new earnings_cashout_service_1.EarningsCashoutService(store);
        expect(() => service.createCashoutRequest('driver-demo-001', {
            methodId: 'mobile-money',
            amount: 999999,
        })).toThrow();
    });
});
//# sourceMappingURL=earnings-cashout.service.spec.js.map