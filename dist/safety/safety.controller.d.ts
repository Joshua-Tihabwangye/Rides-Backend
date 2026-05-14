import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { EmergencyContactDto, SafetyCheckRespondDto, SosDto, TemporaryStopRequestDto, TemporaryStopRespondDto } from './dto/safety.dto';
import { SafetyService } from './safety.service';
export declare class SafetyController {
    private readonly safetyService;
    private readonly apiResponse;
    constructor(safetyService: SafetyService, apiResponse: ApiResponseService);
    getSafetyState(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    }>>;
    saveSafetyState(user: AuthenticatedUser, tripId: string, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    }>>;
    temporaryStopRequest(user: AuthenticatedUser, tripId: string, body: TemporaryStopRequestDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>>;
    temporaryStopRequestCompat(user: AuthenticatedUser, tripId: string, body: TemporaryStopRequestDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>>;
    temporaryStopRespond(user: AuthenticatedUser, tripId: string, body: TemporaryStopRespondDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>>;
    temporaryStopRespondCompat(user: AuthenticatedUser, tripId: string, body: TemporaryStopRespondDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>>;
    temporaryStopResume(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>>;
    temporaryStopResumeCompat(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>>;
    safetyCheckRespond(user: AuthenticatedUser, tripId: string, body: SafetyCheckRespondDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>>;
    sos(user: AuthenticatedUser, tripId: string, body: SosDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>>;
    sosCompat(user: AuthenticatedUser, tripId: string, body: SosDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }>>;
    listEmergencyContacts(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        phone: string;
        name: string;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        relationship: string | null;
    }[]>>;
    createEmergencyContact(user: AuthenticatedUser, body: EmergencyContactDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        phone: string;
        name: string;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        relationship: string | null;
    }>>;
    patchEmergencyContact(user: AuthenticatedUser, contactId: string, body: EmergencyContactDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        phone: string;
        name: string;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        relationship: string | null;
    }>>;
    deleteEmergencyContact(user: AuthenticatedUser, contactId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    listTripShareContacts(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    addTripShareContact(user: AuthenticatedUser, tripId: string, body: {
        name: string;
        phone: string;
        relationship?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        phone: string;
        relationship: string | undefined;
        createdAt: number;
    }>>;
    deleteTripShareContact(user: AuthenticatedUser, tripId: string, contactId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    createTripShareLink(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        tripId: string;
        shareUrl: string;
        createdAt: number;
        expiresAt: number;
        driverId: string;
    }>>;
    getTripShareStatus(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        tripId: string;
        contactsCount: number;
        sharingEnabled: boolean;
        lastUpdatedAt: number;
    }>>;
    listTrainingModules(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    getTrainingModule(user: AuthenticatedUser, moduleId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    createTrainingAttempt(user: AuthenticatedUser, moduleId: string, body: {
        answers?: Record<string, unknown>;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        moduleId: string;
        score: number;
        passed: boolean;
        attemptedAt: number;
    }>>;
    completeTrainingModule(user: AuthenticatedUser, moduleId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
}
