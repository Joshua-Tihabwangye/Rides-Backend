"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const documents_service_1 = require("../src/documents/documents.service");
const in_memory_store_service_1 = require("../src/storage/in-memory-store.service");
describe('DocumentsService', () => {
    it('rejects non-future expiry date', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new documents_service_1.DocumentsService(store);
        expect(() => service.upsert('driver-demo-001', {
            documentType: 'drivers_license',
            fileUrl: 'https://example.com/license.pdf',
            expiryDate: '2000-01-01',
        })).toThrow();
    });
    it('reports expired status when existing document has past date', () => {
        const store = new in_memory_store_service_1.InMemoryStoreService();
        const service = new documents_service_1.DocumentsService(store);
        store.driverDocuments.push({
            id: 'doc-1',
            driverId: 'driver-demo-001',
            documentType: 'drivers_license',
            fileUrl: 'https://example.com/license.pdf',
            expiryDate: '2000-01-01',
            status: 'verified',
            updatedAt: Date.now(),
        });
        const status = service.getDocumentsStatus('driver-demo-001');
        const license = status.documents.find((item) => item.documentType === 'drivers_license');
        expect(license?.expiryStatus).toBe('expired');
    });
});
//# sourceMappingURL=documents.service.spec.js.map