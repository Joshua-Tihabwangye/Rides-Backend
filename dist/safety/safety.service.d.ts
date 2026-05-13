import { Repository } from 'typeorm';
import { SafetyEvent } from '../entities/safety-event.entity';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { DriverProfile } from '../entities/driver-profile.entity';
export declare class SafetyService {
    private safetyEventRepo;
    private emergencyContactRepo;
    private driverProfileRepo;
    private readonly shareContactsStore;
    private readonly trainingModuleStore;
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
    getTripSafetyState(driverId: string, tripId: string): Promise<{
        tripId: string;
        temporaryStop: {
            status: "stop_requested" | "temporarily_stopped" | "idle";
            requestNote: string | undefined;
        };
        safetyCheck: {
            status: string;
            driverAction: "sos" | "okay" | null;
            passengerAction: "sos" | "okay" | null;
        };
        lastEmergencyDispatch: {
            id: string;
            tripId: string;
            triggeredBy: "driver" | "passenger";
            triggeredAt: number;
            contactsNotified: string[];
            location: {
                latitude: number;
                longitude: number;
                accuracy: number | undefined;
                timestamp: number;
            } | null;
            helpMessage: string | undefined;
        } | null;
        updatedAt: number;
    }>;
    saveTripSafetyState(driverId: string, tripId: string, state: Record<string, unknown>): Promise<{
        tripId: string;
        temporaryStop: {
            status: "stop_requested" | "temporarily_stopped" | "idle";
            requestNote: string | undefined;
        };
        safetyCheck: {
            status: string;
            driverAction: "sos" | "okay" | null;
            passengerAction: "sos" | "okay" | null;
        };
        lastEmergencyDispatch: {
            id: string;
            tripId: string;
            triggeredBy: "driver" | "passenger";
            triggeredAt: number;
            contactsNotified: string[];
            location: {
                latitude: number;
                longitude: number;
                accuracy: number | undefined;
                timestamp: number;
            } | null;
            helpMessage: string | undefined;
        } | null;
        updatedAt: number;
    }>;
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
    listTripShareContacts(driverId: string, tripId: string): Promise<Record<string, unknown>[]>;
    addTripShareContact(driverId: string, tripId: string, input: {
        name: string;
        phone: string;
        relationship?: string;
    }): Promise<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        phone: string;
        relationship: string | undefined;
        createdAt: number;
    }>;
    deleteTripShareContact(driverId: string, tripId: string, contactId: string): Promise<{
        deleted: boolean;
    }>;
    createTripShareLink(driverId: string, tripId: string): Promise<{
        tripId: string;
        shareUrl: string;
        createdAt: number;
        expiresAt: number;
        driverId: string;
    }>;
    getTripShareStatus(driverId: string, tripId: string): Promise<{
        tripId: string;
        contactsCount: number;
        sharingEnabled: boolean;
        lastUpdatedAt: number;
    }>;
    listTrainingModules(driverId: string): Promise<Record<string, unknown>[]>;
    getTrainingModule(driverId: string, moduleId: string): Promise<Record<string, unknown>>;
    createTrainingAttempt(driverId: string, moduleId: string, input: {
        answers?: Record<string, unknown>;
    }): Promise<{
        moduleId: string;
        score: number;
        passed: boolean;
        attemptedAt: number;
    }>;
    completeTrainingModule(driverId: string, moduleId: string): Promise<Record<string, unknown>>;
}
