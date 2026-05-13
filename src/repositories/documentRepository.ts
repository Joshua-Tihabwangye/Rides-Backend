import type { DriverDocumentRecord, DriverDocumentType } from "../types/document";

export interface DriverDocumentRepository {
  upsertDocument(input: {
    driverId: string;
    documentType: DriverDocumentType;
    fileUrl: string;
    expiryDate: Date;
  }): Promise<DriverDocumentRecord>;
  listRequiredDocumentsByDriver(driverId: string): Promise<DriverDocumentRecord[]>;
  listDocumentsExpiringWithin(days: number): Promise<DriverDocumentRecord[]>;
}
