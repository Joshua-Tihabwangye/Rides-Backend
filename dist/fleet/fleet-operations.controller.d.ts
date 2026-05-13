import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { CreateFleetComplianceIncidentDto, CreateFleetDispatchDto, CreateFleetServiceDto, CreateFleetTrainingCourseDto, FleetEarningsQueryDto } from './dto/fleet.dto';
import { FleetService } from './fleet.service';
export declare class FleetOperationsController {
    private readonly fleetService;
    private readonly apiResponse;
    constructor(fleetService: FleetService, apiResponse: ApiResponseService);
    listDispatches(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-dispatch.entity").FleetDispatch[]>>;
    createDispatch(user: AuthenticatedUser, body: CreateFleetDispatchDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        dispatch: import("../entities/fleet-dispatch.entity").FleetDispatch;
        trip: import("../entities/trip.entity").Trip;
    }>>;
    listTrips(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip[]>>;
    listAmbulanceDispatches(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-dispatch.entity").FleetDispatch[]>>;
    createAmbulanceDispatch(user: AuthenticatedUser, body: CreateFleetDispatchDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        dispatch: import("../entities/fleet-dispatch.entity").FleetDispatch;
        trip: import("../entities/trip.entity").Trip;
    }>>;
    listRentals(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord[]>>;
    createRental(user: AuthenticatedUser, body: CreateFleetServiceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    listTours(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord[]>>;
    createTour(user: AuthenticatedUser, body: CreateFleetServiceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    listSchoolShuttles(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord[]>>;
    createSchoolShuttle(user: AuthenticatedUser, body: CreateFleetServiceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    getEarningsSummary(user: AuthenticatedUser, query: FleetEarningsQueryDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        period: "day" | "week" | "month" | "quarter" | "year";
        total: number;
        currency: string;
        count: number;
    }>>;
    getStatements(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        statementMonth: string;
        total: number;
        currency: string;
    }[]>>;
    getPayouts(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-payout.entity").FleetPayout[]>>;
    listComplianceIncidents(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-compliance-incident.entity").FleetComplianceIncident[]>>;
    createComplianceIncident(user: AuthenticatedUser, body: CreateFleetComplianceIncidentDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-compliance-incident.entity").FleetComplianceIncident>>;
    listTrainingCourses(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-training-course.entity").FleetTrainingCourse[]>>;
    createTrainingCourse(user: AuthenticatedUser, body: CreateFleetTrainingCourseDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-training-course.entity").FleetTrainingCourse>>;
    listRiderServiceRequests(user: AuthenticatedUser, serviceType: 'rental' | 'tour' | 'ambulance' | undefined, status: string | undefined, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        driverId: string;
        serviceType: "rental" | "tour" | "ambulance";
        status: string;
        payload: Record<string, any>;
        createdAt: number;
        updatedAt: number;
    }[]>>;
}
