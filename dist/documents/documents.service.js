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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_document_entity_1 = require("../entities/user-document.entity");
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
    constructor(documentRepo) {
        this.documentRepo = documentRepo;
    }
    async upsertForUser(userType, userId, input) {
        this.ensureFutureDate(input.expiryDate);
        let doc = await this.documentRepo.findOne({
            where: { userType, userId, documentType: input.documentType },
        });
        if (doc) {
            doc.fileUrl = input.fileUrl;
            doc.expiryDate = input.expiryDate;
            doc.status = 'under_review';
            doc.rejectionReason = null;
        }
        else {
            doc = this.documentRepo.create({
                userType,
                userId,
                documentType: input.documentType,
                fileUrl: input.fileUrl,
                expiryDate: input.expiryDate,
                status: 'under_review',
            });
        }
        return this.documentRepo.save(doc);
    }
    async listForUser(userType, userId) {
        return this.documentRepo.find({
            where: { userType, userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getDocumentsStatusForUser(userType, userId) {
        const docs = await this.listForUser(userType, userId);
        return this.buildStatusPayload(userType, docs);
    }
    async patchForUser(userType, userId, documentId, patch) {
        const doc = await this.documentRepo.findOne({
            where: { id: documentId, userId, userType },
        });
        if (!doc) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (patch.expiryDate) {
            this.ensureFutureDate(patch.expiryDate);
            doc.expiryDate = patch.expiryDate;
        }
        if (patch.fileUrl)
            doc.fileUrl = patch.fileUrl;
        if (patch.status)
            doc.status = patch.status;
        if (patch.rejectionReason !== undefined)
            doc.rejectionReason = patch.rejectionReason;
        return this.documentRepo.save(doc);
    }
    async resubmitForUser(userType, userId, documentId, input) {
        return this.patchForUser(userType, userId, documentId, {
            ...input,
            status: 'under_review',
            rejectionReason: '',
        });
    }
    async deleteForUser(userType, userId, documentId) {
        const doc = await this.documentRepo.findOne({
            where: { id: documentId, userId, userType },
        });
        if (!doc) {
            throw new common_1.NotFoundException('Document not found');
        }
        await this.documentRepo.remove(doc);
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
    __param(0, (0, typeorm_1.InjectRepository)(user_document_entity_1.UserDocument)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map