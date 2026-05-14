"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const REQUIRED_DOCUMENT_TYPES = {
    driver: [
        'national_id_or_passport',
        'drivers_license',
        'conduct_clearance',
        'vehicle_logbook',
        'vehicle_insurance',
        'vehicle_inspection',
    ],
    rider: ['national_id_or_passport'],
    fleet: ['business_registration', 'tax_clearance', 'insurance_certificate'],
    admin: ['staff_id'],
};
let DocumentsService = class DocumentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertForUser(userType, userId, input) {
        this.ensureFutureDate(input.expiryDate);
        const existing = await this.prisma.userDocument.findFirst({
            where: { userType, userId, documentType: input.documentType },
        });
        if (existing) {
            return this.prisma.userDocument.update({
                where: { id: existing.id },
                data: {
                    fileUrl: input.fileUrl,
                    expiryDate: input.expiryDate,
                    status: 'under_review',
                    rejectionReason: null,
                },
            });
        }
        return this.prisma.userDocument.create({
            data: {
                userType,
                userId,
                documentType: input.documentType,
                fileUrl: input.fileUrl,
                expiryDate: input.expiryDate,
                status: 'under_review',
            },
        });
    }
    async listForUser(userType, userId) {
        return this.prisma.userDocument.findMany({
            where: { userType, userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getDocumentsStatusForUser(userType, userId) {
        const docs = await this.listForUser(userType, userId);
        return this.buildStatusPayload(userType, docs);
    }
    async patchForUser(userType, userId, documentId, patch) {
        const doc = await this.prisma.userDocument.findFirst({
            where: { id: documentId, userId, userType },
        });
        if (!doc) {
            throw new common_1.NotFoundException('Document not found');
        }
        const data = {};
        if (patch.expiryDate) {
            this.ensureFutureDate(patch.expiryDate);
            data.expiryDate = patch.expiryDate;
        }
        if (patch.fileUrl)
            data.fileUrl = patch.fileUrl;
        if (patch.status)
            data.status = patch.status;
        if (patch.rejectionReason !== undefined)
            data.rejectionReason = patch.rejectionReason;
        return this.prisma.userDocument.update({ where: { id: documentId }, data });
    }
    async resubmitForUser(userType, userId, documentId, input) {
        return this.patchForUser(userType, userId, documentId, {
            ...input,
            status: 'under_review',
            rejectionReason: '',
        });
    }
    async deleteForUser(userType, userId, documentId) {
        const doc = await this.prisma.userDocument.findFirst({
            where: { id: documentId, userId, userType },
        });
        if (!doc) {
            throw new common_1.NotFoundException('Document not found');
        }
        await this.prisma.userDocument.delete({ where: { id: documentId } });
        return { deleted: true };
    }
    buildStatusPayload(userType, docs) {
        const indexed = new Map(docs.map((doc) => [doc.documentType, doc]));
        const requiredTypes = REQUIRED_DOCUMENT_TYPES[userType];
        return {
            userType,
            documents: requiredTypes.map((requiredType) => {
                const doc = indexed.get(requiredType);
                if (!doc) {
                    return {
                        id: `missing-${requiredType}`,
                        documentType: requiredType,
                        fileUrl: '',
                        expiryDate: '',
                        reviewStatus: 'pending',
                        expiryStatus: 'expired',
                        daysUntilExpiry: null,
                    };
                }
                return {
                    id: doc.id,
                    documentType: doc.documentType,
                    fileUrl: doc.fileUrl,
                    expiryDate: doc.expiryDate,
                    reviewStatus: doc.status,
                    expiryStatus: this.getExpiryStatus(doc.expiryDate),
                    daysUntilExpiry: this.getDaysUntilExpiry(doc.expiryDate),
                };
            }),
        };
    }
    ensureFutureDate(dateText) {
        const parsed = this.parseDate(dateText);
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (parsed.getTime() <= start.getTime()) {
            throw new common_1.BadRequestException('Expiry date must be in the future.');
        }
    }
    parseDate(dateText) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
            throw new common_1.BadRequestException('Invalid expiry date format. Use YYYY-MM-DD.');
        }
        const date = new Date(`${dateText}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid expiry date format. Use YYYY-MM-DD.');
        }
        return date;
    }
    getDaysUntilExpiry(dateText) {
        const expiry = this.parseDate(dateText);
        const now = new Date();
        const startExpiry = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate()).getTime();
        const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        return Math.ceil((startExpiry - startNow) / (24 * 60 * 60 * 1000));
    }
    getExpiryStatus(dateText) {
        const days = this.getDaysUntilExpiry(dateText);
        if (days < 0) {
            return 'expired';
        }
        if (days <= 30) {
            return 'expiring_soon';
        }
        return 'valid';
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map