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
            status: "idle" | "stop_requested" | "temporarily_stopped";
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
    }>>;
    saveSafetyState(user: AuthenticatedUser, tripId: string, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        tripId: string;
        temporaryStop: {
            status: "idle" | "stop_requested" | "temporarily_stopped";
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
    }>>;
    temporaryStopRequest(user: AuthenticatedUser, tripId: string, body: TemporaryStopRequestDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/safety-event.entity").SafetyEvent>>;
    temporaryStopRequestCompat(user: AuthenticatedUser, tripId: string, body: TemporaryStopRequestDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/safety-event.entity").SafetyEvent>>;
    temporaryStopRespond(user: AuthenticatedUser, tripId: string, body: TemporaryStopRespondDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/safety-event.entity").SafetyEvent>>;
    temporaryStopRespondCompat(user: AuthenticatedUser, tripId: string, body: TemporaryStopRespondDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/safety-event.entity").SafetyEvent>>;
    temporaryStopResume(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/safety-event.entity").SafetyEvent>>;
    temporaryStopResumeCompat(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/safety-event.entity").SafetyEvent>>;
    safetyCheckRespond(user: AuthenticatedUser, tripId: string, body: SafetyCheckRespondDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/safety-event.entity").SafetyEvent>>;
    sos(user: AuthenticatedUser, tripId: string, body: SosDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/safety-event.entity").SafetyEvent>>;
    sosCompat(user: AuthenticatedUser, tripId: string, body: SosDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/safety-event.entity").SafetyEvent>>;
    listEmergencyContacts(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/emergency-contact.entity").EmergencyContact[]>>;
    createEmergencyContact(user: AuthenticatedUser, body: EmergencyContactDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/emergency-contact.entity").EmergencyContact>>;
    patchEmergencyContact(user: AuthenticatedUser, contactId: string, body: EmergencyContactDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/emergency-contact.entity").EmergencyContact>>;
    deleteEmergencyContact(user: AuthenticatedUser, contactId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
}
