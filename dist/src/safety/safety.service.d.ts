import { Repository } from 'typeorm';
import { SafetyEvent } from '../entities/safety-event.entity';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { DriverProfile } from '../entities/driver-profile.entity';
export declare class SafetyService {
    private safetyEventRepo;
    private emergencyContactRepo;
    private driverProfileRepo;
    constructor(safetyEventRepo: Repository<SafetyEvent>, emergencyContactRepo: Repository<EmergencyContact>, driverProfileRepo: Repository<DriverProfile>);
    requestTemporaryStop(driverId: string, tripId: string, note?: string): Promise<SafetyEvent>;
    respondTemporaryStop(driverId: string, tripId: string, decision: 'confirm' | 'decline'): Promise<SafetyEvent>;
    resumeTemporaryStop(driverId: string, tripId: string): Promise<SafetyEvent>;
    respondSafetyCheck(driverId: string, tripId: string, actor: 'driver' | 'passenger', action: 'okay' | 'sos'): Promise<SafetyEvent>;
    triggerSos(driverId: string, tripId: string, payload: {
        contactsNotified?: string[];
        latitude?: number;
        longitude?: number;
        helpMessage?: string;
    }): Promise<SafetyEvent>;
    listEmergencyContacts(driverId: string): Promise<EmergencyContact[]>;
    createEmergencyContact(driverId: string, input: {
        name: string;
        phone: string;
        relationship?: string;
    }): Promise<EmergencyContact>;
    patchEmergencyContact(driverId: string, contactId: string, patch: Partial<{
        name: string;
        phone: string;
        relationship?: string;
    }>): Promise<EmergencyContact>;
    deleteEmergencyContact(driverId: string, contactId: string): Promise<{
        deleted: boolean;
    }>;
}
