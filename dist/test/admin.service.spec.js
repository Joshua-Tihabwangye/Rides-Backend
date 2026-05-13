"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_service_1 = require("../src/admin/admin.service");
const in_memory_store_service_1 = require("../src/storage/in-memory-store.service");
describe('AdminService', () => {
    it('creates and updates admin-managed users', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new admin_service_1.AdminService(store);
        const created = service.createDriver('admin-demo-001', {
            email: 'managed-driver@example.com',
            phone: '+256700444555',
            fullName: 'Managed Driver',
        });
        const updated = service.patchDriver('admin-demo-001', created.driverId, {
            city: 'Entebbe',
            status: 'active',
        });
        expect(created.driverId).toBeDefined();
        expect(updated.city).toBe('Entebbe');
    });
    it('creates companies and reviews approvals', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new admin_service_1.AdminService(store);
        const company = service.createCompany('admin-demo-001', {
            companyName: 'Metro Fleet',
            contactEmail: 'metro@example.com',
            contactPhone: '+256700777888',
        });
        const reviewed = service.reviewApproval('admin-demo-001', company.approvalId, {
            decision: 'approved',
            notes: 'Approved after review',
        });
        expect(reviewed.status).toBe('approved');
        expect(service.listCompanies().some((item) => item.fleetId === company.fleetId)).toBe(true);
    });
    it('creates admin product configuration and audit events', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new admin_service_1.AdminService(store);
        const pricing = service.createPricing('admin-demo-001', {
            name: 'Airport Transfer',
            service: 'ride',
            pricingRules: { baseFare: 5000 },
        });
        service.createPromo('admin-demo-001', {
            code: 'AIRPORT20',
            description: 'Airport discount',
            discountType: 'percent',
            discountValue: 20,
        });
        expect(pricing.id).toBeDefined();
        expect(service.getAuditLog().some((item) => item.resource === 'pricing')).toBe(true);
    });
    it('updates app backend feature flags', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new admin_service_1.AdminService(store);
        const updated = service.patchFeatureFlag('admin-demo-001', 'driver_backend_enabled', {
            enabled: false,
            description: 'Disable driver backend rollout',
        });
        expect(updated.key).toBe('driver_backend_enabled');
        expect(updated.enabled).toBe(false);
        expect(service.getAuditLog().some((item) => item.resource === 'feature_flag')).toBe(true);
    });
});
//# sourceMappingURL=admin.service.spec.js.map