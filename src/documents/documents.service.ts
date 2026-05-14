import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserDocument } from '@prisma/client';

type UserType = 'driver' | 'rider' | 'fleet' | 'admin';
type ExpiryStatus = 'valid' | 'expiring_soon' | 'expired';

const REQUIRED_DOCUMENT_TYPES: Record<UserType, readonly string[]> = {
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

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertForUser(userType: UserType, userId: string, input: { documentType: string; fileUrl: string; expiryDate: string }) {
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

  async listForUser(userType: UserType, userId: string) {
    return this.prisma.userDocument.findMany({
      where: { userType, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocumentsStatusForUser(userType: UserType, userId: string) {
    const docs = await this.listForUser(userType, userId);
    return this.buildStatusPayload(userType, docs);
  }

  async patchForUser(
    userType: UserType,
    userId: string,
    documentId: string,
    patch: Partial<{ status: string; rejectionReason: string; fileUrl: string; expiryDate: string }>,
  ) {
    const doc = await this.prisma.userDocument.findFirst({
      where: { id: documentId, userId, userType },
    });
    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    const data: Record<string, unknown> = {};
    if (patch.expiryDate) {
      this.ensureFutureDate(patch.expiryDate);
      data.expiryDate = patch.expiryDate;
    }
    if (patch.fileUrl) data.fileUrl = patch.fileUrl;
    if (patch.status) data.status = patch.status;
    if (patch.rejectionReason !== undefined) data.rejectionReason = patch.rejectionReason;

    return this.prisma.userDocument.update({ where: { id: documentId }, data });
  }

  async resubmitForUser(userType: UserType, userId: string, documentId: string, input: { fileUrl?: string; expiryDate?: string }) {
    return this.patchForUser(userType, userId, documentId, {
      ...input,
      status: 'under_review',
      rejectionReason: '',
    });
  }

  async deleteForUser(userType: UserType, userId: string, documentId: string) {
    const doc = await this.prisma.userDocument.findFirst({
      where: { id: documentId, userId, userType },
    });
    if (!doc) {
      throw new NotFoundException('Document not found');
    }
    await this.prisma.userDocument.delete({ where: { id: documentId } });
    return { deleted: true };
  }

  private buildStatusPayload(userType: UserType, docs: UserDocument[]) {
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
            expiryStatus: 'expired' as ExpiryStatus,
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

  private ensureFutureDate(dateText: string) {
    const parsed = this.parseDate(dateText);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (parsed.getTime() <= start.getTime()) {
      throw new BadRequestException('Expiry date must be in the future.');
    }
  }

  private parseDate(dateText: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
      throw new BadRequestException('Invalid expiry date format. Use YYYY-MM-DD.');
    }

    const date = new Date(`${dateText}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid expiry date format. Use YYYY-MM-DD.');
    }
    return date;
  }

  private getDaysUntilExpiry(dateText: string) {
    const expiry = this.parseDate(dateText);
    const now = new Date();
    const startExpiry = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate()).getTime();
    const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return Math.ceil((startExpiry - startNow) / (24 * 60 * 60 * 1000));
  }

  private getExpiryStatus(dateText: string): ExpiryStatus {
    const days = this.getDaysUntilExpiry(dateText);
    if (days < 0) {
      return 'expired';
    }
    if (days <= 30) {
      return 'expiring_soon';
    }
    return 'valid';
  }
}
