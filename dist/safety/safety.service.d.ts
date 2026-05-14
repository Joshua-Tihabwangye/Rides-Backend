import { PrismaService } from '../prisma/prisma.service';
export declare class SafetyService {
    private readonly prisma;
    private readonly shareContactsStore;
    private readonly trainingModuleStore;
    constructor(prisma: PrismaService);
    requestTemporaryStop(driverId: string, tripId: string, note?: string): Promise<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    respondTemporaryStop(driverId: string, tripId: string, decision: 'confirm' | 'decline'): Promise<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    resumeTemporaryStop(driverId: string, tripId: string): Promise<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    respondSafetyCheck(driverId: string, tripId: string, actor: 'driver' | 'passenger', action: 'okay' | 'sos'): Promise<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    triggerSos(driverId: string, tripId: string, payload: {
        contactsNotified?: string[];
        latitude?: number;
        longitude?: number;
        helpMessage?: string;
    }): Promise<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    getTripSafetyState(driverId: string, tripId: string): Promise<{
        tripId: string;
        temporaryStop: {
            status: any;
            requestNote: any;
        };
        safetyCheck: {
            status: any;
            driverAction: any;
            passengerAction: any;
        };
        lastEmergencyDispatch: {
            id: string;
            tripId: string;
            triggeredBy: any;
            triggeredAt: number;
            contactsNotified: any;
            location: {
                latitude: number;
                longitude: number;
                accuracy: any;
                timestamp: number;
            } | null;
            helpMessage: any;
        } | null;
        updatedAt: number;
    }>;
    saveTripSafetyState(driverId: string, tripId: string, state: Record<string, unknown>): Promise<{
        tripId: string;
        temporaryStop: {
            status: any;
            requestNote: any;
        };
        safetyCheck: {
            status: any;
            driverAction: any;
            passengerAction: any;
        };
        lastEmergencyDispatch: {
            id: string;
            tripId: string;
            triggeredBy: any;
            triggeredAt: number;
            contactsNotified: any;
            location: {
                latitude: number;
                longitude: number;
                accuracy: any;
                timestamp: number;
            } | null;
            helpMessage: any;
        } | null;
        updatedAt: number;
    }>;
    listEmergencyContacts(driverId: string): Promise<{
        phone: string;
        name: string;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        relationship: string | null;
    }[]>;
    createEmergencyContact(driverId: string, input: {
        name: string;
        phone: string;
        relationship?: string;
    }): Promise<{
        phone: string;
        name: string;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        relationship: string | null;
    }>;
    patchEmergencyContact(driverId: string, contactId: string, patch: Partial<{
        name: string;
        phone: string;
        relationship?: string;
    }>): Promise<{
        phone: string;
        name: string;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        relationship: string | null;
    }>;
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
