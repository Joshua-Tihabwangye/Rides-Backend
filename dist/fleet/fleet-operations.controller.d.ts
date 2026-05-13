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
    getStatementById(user: AuthenticatedUser, statementId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        statementMonth: string;
        total: number;
        currency: string;
    }>>;
    getPayouts(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-payout.entity").FleetPayout[]>>;
    getPayoutById(user: AuthenticatedUser, payoutId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-payout.entity").FleetPayout>>;
    listComplianceIncidents(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-compliance-incident.entity").FleetComplianceIncident[]>>;
    createComplianceIncident(user: AuthenticatedUser, body: CreateFleetComplianceIncidentDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-compliance-incident.entity").FleetComplianceIncident>>;
    getComplianceIncidentById(user: AuthenticatedUser, incidentId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-compliance-incident.entity").FleetComplianceIncident>>;
    patchComplianceIncidentById(user: AuthenticatedUser, incidentId: string, body: Partial<{
        category: string;
        severity: string;
        status: string;
        description: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-compliance-incident.entity").FleetComplianceIncident>>;
    listTrainingCourses(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-training-course.entity").FleetTrainingCourse[]>>;
    createTrainingCourse(user: AuthenticatedUser, body: CreateFleetTrainingCourseDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-training-course.entity").FleetTrainingCourse>>;
    getTrainingCourseById(user: AuthenticatedUser, courseId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-training-course.entity").FleetTrainingCourse>>;
    patchTrainingCourseById(user: AuthenticatedUser, courseId: string, body: Partial<{
        title: string;
        status: string;
        assignedTo?: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-training-course.entity").FleetTrainingCourse>>;
    deleteTrainingCourseById(user: AuthenticatedUser, courseId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    getDispatchById(user: AuthenticatedUser, dispatchId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-dispatch.entity").FleetDispatch>>;
    patchDispatchById(user: AuthenticatedUser, dispatchId: string, body: Partial<{
        pickup: string;
        dropoff: string;
        notes: string;
        status: string;
        driverId: string;
        vehicleId: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-dispatch.entity").FleetDispatch>>;
    deleteDispatchById(user: AuthenticatedUser, dispatchId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    assignDispatch(user: AuthenticatedUser, dispatchId: string, body: {
        driverId?: string;
        vehicleId?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-dispatch.entity").FleetDispatch>>;
    getRentalById(user: AuthenticatedUser, rentalId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    patchRentalById(user: AuthenticatedUser, rentalId: string, body: Partial<{
        customerName: string;
        assetId: string;
        scheduledAt: number;
        notes: string;
        status: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    cancelRentalById(user: AuthenticatedUser, rentalId: string, body: {
        reason?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    getTourById(user: AuthenticatedUser, tourId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    patchTourById(user: AuthenticatedUser, tourId: string, body: Partial<{
        customerName: string;
        assetId: string;
        scheduledAt: number;
        notes: string;
        status: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    cancelTourById(user: AuthenticatedUser, tourId: string, body: {
        reason?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    getSchoolShuttleById(user: AuthenticatedUser, serviceId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    patchSchoolShuttleById(user: AuthenticatedUser, serviceId: string, body: Partial<{
        customerName: string;
        assetId: string;
        scheduledAt: number;
        notes: string;
        status: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    cancelSchoolShuttleById(user: AuthenticatedUser, serviceId: string, body: {
        reason?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-service-record.entity").FleetServiceRecord>>;
    schoolListRoutes(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    schoolCreateRoute(user: AuthenticatedUser, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        createdAt: number;
        updatedAt: number;
        id: string;
    }>>;
    schoolGetRoute(user: AuthenticatedUser, routeId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    schoolPatchRoute(user: AuthenticatedUser, routeId: string, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    schoolDeleteRoute(user: AuthenticatedUser, routeId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    schoolListStudents(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    schoolCreateStudent(user: AuthenticatedUser, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        createdAt: number;
        updatedAt: number;
        id: string;
    }>>;
    schoolGetStudent(user: AuthenticatedUser, studentId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    schoolPatchStudent(user: AuthenticatedUser, studentId: string, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    schoolDeleteStudent(user: AuthenticatedUser, studentId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    schoolListAttendance(user: AuthenticatedUser, studentId: string | undefined, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    schoolUpsertAttendance(user: AuthenticatedUser, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        createdAt: number;
        updatedAt: number;
        id: string;
    }>>;
    schoolListTrips(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    schoolCreateTrip(user: AuthenticatedUser, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        createdAt: number;
        updatedAt: number;
        id: string;
        status: string;
    }>>;
    schoolGetTrip(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    schoolPatchTrip(user: AuthenticatedUser, tripId: string, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    schoolCancelTrip(user: AuthenticatedUser, tripId: string, body: {
        reason?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    schoolTripLive(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        tripId: string;
        status: unknown;
        vehicleLocation: {
            lat: number;
            lng: number;
        };
        updatedAt: number;
    }>>;
    schoolListAttendants(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    schoolCreateAttendant(user: AuthenticatedUser, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        createdAt: number;
        updatedAt: number;
        id: string;
    }>>;
    schoolGetAttendant(user: AuthenticatedUser, attendantId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    schoolPatchAttendant(user: AuthenticatedUser, attendantId: string, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    schoolDeleteAttendant(user: AuthenticatedUser, attendantId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    schoolListPayments(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    schoolCreatePayment(user: AuthenticatedUser, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        createdAt: number;
        id: string;
    }>>;
    schoolListFeedback(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    schoolCreateFeedback(user: AuthenticatedUser, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        createdAt: number;
        id: string;
    }>>;
    schoolRoster(user: AuthenticatedUser, routeId: string | undefined, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    schoolTripCalendar(user: AuthenticatedUser, date: string | undefined, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    schoolPerformanceReport(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        tripsTotal: number;
        tripsCompleted: number;
        onTimeRate: number;
        attendanceEntries: number;
    }>>;
    schoolBulkReminders(user: AuthenticatedUser, body: {
        message: string;
        target?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        sent: boolean;
        message: string;
        target: string;
        sentAt: number;
    }>>;
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
