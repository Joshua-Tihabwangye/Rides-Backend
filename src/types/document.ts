export type DriverDocumentType =
  | "national_id_or_passport"
  | "drivers_license"
  | "conduct_clearance"
  | "vehicle_logbook"
  | "vehicle_insurance"
  | "vehicle_inspection";

export type DocumentExpiryStatus = "valid" | "expiring_soon" | "expired";

export interface DriverDocumentRecord {
  id: string;
  driverId: string;
  documentType: DriverDocumentType;
  fileUrl: string;
  expiryDate: Date;
}

export interface UploadDriverDocumentInput {
  driverId: string;
  documentType: DriverDocumentType;
  fileUrl: string;
  expiryDate: string;
}
