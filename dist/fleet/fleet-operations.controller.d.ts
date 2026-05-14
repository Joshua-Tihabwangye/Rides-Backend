import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { CreateFleetComplianceIncidentDto, CreateFleetDispatchDto, CreateFleetServiceDto, CreateFleetTrainingCourseDto, FleetEarningsQueryDto } from './dto/fleet.dto';
import { FleetService } from './fleet.service';
export declare class FleetOperationsController {
    private readonly fleetService;
    private readonly apiResponse;
    constructor(fleetService: FleetService, apiResponse: ApiResponseService);
    listDispatches(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetDispatchStatus;
        notes: string | null;
        type: string;
        id: string;
        driverId: string | null;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        tripId: string | null;
        pickup: string;
        dropoff: string;
        vehicleId: string | null;
    }[]>>;
    createDispatch(user: AuthenticatedUser, body: CreateFleetDispatchDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        dispatch: {
            status: import(".prisma/client").$Enums.FleetDispatchStatus;
            notes: string | null;
            type: string;
            id: string;
            driverId: string | null;
            fleetId: string;
            createdAt: Date;
            updatedAt: Date;
            tripId: string | null;
            pickup: string;
            dropoff: string;
            vehicleId: string | null;
        };
        trip: {
            status: import(".prisma/client").$Enums.TripStatus;
            type: import(".prisma/client").$Enums.TripType;
            id: string;
            driverId: string | null;
            riderId: string;
            fleetId: string | null;
            createdAt: Date;
            updatedAt: Date;
            rating: import("@prisma/client/runtime/client").JsonValue | null;
            fleetPartnerId: string | null;
            pickupLocation: import("@prisma/client/runtime/client").JsonValue;
            dropoffLocation: import("@prisma/client/runtime/client").JsonValue;
            pickup: string | null;
            dropoff: string | null;
            pickupAddress: string;
            dropoffAddress: string;
            route: import("@prisma/client/runtime/client").JsonValue | null;
            fare: import("@prisma/client-runtime-utils").Decimal;
            driverEarnings: import("@prisma/client-runtime-utils").Decimal;
            platformFee: import("@prisma/client-runtime-utils").Decimal;
            payment: import("@prisma/client/runtime/client").JsonValue | null;
            otpCode: string | null;
            scheduledAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancellationReason: import("@prisma/client/runtime/client").JsonValue | null;
            driverArrivedAt: Date | null;
        };
    }>>;
    listTrips(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.TripStatus;
        type: import(".prisma/client").$Enums.TripType;
        id: string;
        driverId: string | null;
        riderId: string;
        fleetId: string | null;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/client").JsonValue | null;
        fleetPartnerId: string | null;
        pickupLocation: import("@prisma/client/runtime/client").JsonValue;
        dropoffLocation: import("@prisma/client/runtime/client").JsonValue;
        pickup: string | null;
        dropoff: string | null;
        pickupAddress: string;
        dropoffAddress: string;
        route: import("@prisma/client/runtime/client").JsonValue | null;
        fare: import("@prisma/client-runtime-utils").Decimal;
        driverEarnings: import("@prisma/client-runtime-utils").Decimal;
        platformFee: import("@prisma/client-runtime-utils").Decimal;
        payment: import("@prisma/client/runtime/client").JsonValue | null;
        otpCode: string | null;
        scheduledAt: Date | null;
        startedAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: import("@prisma/client/runtime/client").JsonValue | null;
        driverArrivedAt: Date | null;
    }[]>>;
    listAmbulanceDispatches(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetDispatchStatus;
        notes: string | null;
        type: string;
        id: string;
        driverId: string | null;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        tripId: string | null;
        pickup: string;
        dropoff: string;
        vehicleId: string | null;
    }[]>>;
    createAmbulanceDispatch(user: AuthenticatedUser, body: CreateFleetDispatchDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        dispatch: {
            status: import(".prisma/client").$Enums.FleetDispatchStatus;
            notes: string | null;
            type: string;
            id: string;
            driverId: string | null;
            fleetId: string;
            createdAt: Date;
            updatedAt: Date;
            tripId: string | null;
            pickup: string;
            dropoff: string;
            vehicleId: string | null;
        };
        trip: {
            status: import(".prisma/client").$Enums.TripStatus;
            type: import(".prisma/client").$Enums.TripType;
            id: string;
            driverId: string | null;
            riderId: string;
            fleetId: string | null;
            createdAt: Date;
            updatedAt: Date;
            rating: import("@prisma/client/runtime/client").JsonValue | null;
            fleetPartnerId: string | null;
            pickupLocation: import("@prisma/client/runtime/client").JsonValue;
            dropoffLocation: import("@prisma/client/runtime/client").JsonValue;
            pickup: string | null;
            dropoff: string | null;
            pickupAddress: string;
            dropoffAddress: string;
            route: import("@prisma/client/runtime/client").JsonValue | null;
            fare: import("@prisma/client-runtime-utils").Decimal;
            driverEarnings: import("@prisma/client-runtime-utils").Decimal;
            platformFee: import("@prisma/client-runtime-utils").Decimal;
            payment: import("@prisma/client/runtime/client").JsonValue | null;
            otpCode: string | null;
            scheduledAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancellationReason: import("@prisma/client/runtime/client").JsonValue | null;
            driverArrivedAt: Date | null;
        };
    }>>;
    listRentals(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }[]>>;
    createRental(user: AuthenticatedUser, body: CreateFleetServiceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
    listTours(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }[]>>;
    createTour(user: AuthenticatedUser, body: CreateFleetServiceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
    listSchoolShuttles(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }[]>>;
    createSchoolShuttle(user: AuthenticatedUser, body: CreateFleetServiceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
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
    getPayouts(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetPayoutStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
    }[]>>;
    getPayoutById(user: AuthenticatedUser, payoutId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetPayoutStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
    }>>;
    listComplianceIncidents(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetComplianceStatus;
        description: string;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.FleetComplianceSeverity;
        category: string;
    }[]>>;
    createComplianceIncident(user: AuthenticatedUser, body: CreateFleetComplianceIncidentDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetComplianceStatus;
        description: string;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.FleetComplianceSeverity;
        category: string;
    }>>;
    getComplianceIncidentById(user: AuthenticatedUser, incidentId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetComplianceStatus;
        description: string;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.FleetComplianceSeverity;
        category: string;
    }>>;
    patchComplianceIncidentById(user: AuthenticatedUser, incidentId: string, body: Partial<{
        category: string;
        severity: string;
        status: string;
        description: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetComplianceStatus;
        description: string;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.FleetComplianceSeverity;
        category: string;
    }>>;
    listTrainingCourses(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetTrainingStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assignedTo: string | null;
    }[]>>;
    createTrainingCourse(user: AuthenticatedUser, body: CreateFleetTrainingCourseDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetTrainingStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assignedTo: string | null;
    }>>;
    getTrainingCourseById(user: AuthenticatedUser, courseId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetTrainingStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assignedTo: string | null;
    }>>;
    patchTrainingCourseById(user: AuthenticatedUser, courseId: string, body: Partial<{
        title: string;
        status: string;
        assignedTo?: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetTrainingStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assignedTo: string | null;
    }>>;
    deleteTrainingCourseById(user: AuthenticatedUser, courseId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    getDispatchById(user: AuthenticatedUser, dispatchId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetDispatchStatus;
        notes: string | null;
        type: string;
        id: string;
        driverId: string | null;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        tripId: string | null;
        pickup: string;
        dropoff: string;
        vehicleId: string | null;
    }>>;
    patchDispatchById(user: AuthenticatedUser, dispatchId: string, body: Partial<{
        pickup: string;
        dropoff: string;
        notes: string;
        status: string;
        driverId: string;
        vehicleId: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetDispatchStatus;
        notes: string | null;
        type: string;
        id: string;
        driverId: string | null;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        tripId: string | null;
        pickup: string;
        dropoff: string;
        vehicleId: string | null;
    }>>;
    deleteDispatchById(user: AuthenticatedUser, dispatchId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    assignDispatch(user: AuthenticatedUser, dispatchId: string, body: {
        driverId?: string;
        vehicleId?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetDispatchStatus;
        notes: string | null;
        type: string;
        id: string;
        driverId: string | null;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        tripId: string | null;
        pickup: string;
        dropoff: string;
        vehicleId: string | null;
    }>>;
    getRentalById(user: AuthenticatedUser, rentalId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
    patchRentalById(user: AuthenticatedUser, rentalId: string, body: Partial<{
        customerName: string;
        assetId: string;
        scheduledAt: number;
        notes: string;
        status: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
    cancelRentalById(user: AuthenticatedUser, rentalId: string, body: {
        reason?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
    getTourById(user: AuthenticatedUser, tourId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
    patchTourById(user: AuthenticatedUser, tourId: string, body: Partial<{
        customerName: string;
        assetId: string;
        scheduledAt: number;
        notes: string;
        status: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
    cancelTourById(user: AuthenticatedUser, tourId: string, body: {
        reason?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
    getSchoolShuttleById(user: AuthenticatedUser, serviceId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
    patchSchoolShuttleById(user: AuthenticatedUser, serviceId: string, body: Partial<{
        customerName: string;
        assetId: string;
        scheduledAt: number;
        notes: string;
        status: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
    cancelSchoolShuttleById(user: AuthenticatedUser, serviceId: string, body: {
        reason?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetServiceStatus;
        notes: string | null;
        service: import(".prisma/client").$Enums.FleetService;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: bigint;
        customerName: string;
        assetId: string | null;
    }>>;
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
        driverId: string | null;
        serviceType: import(".prisma/client").$Enums.ServiceRequestType;
        status: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        createdAt: number;
        updatedAt: number;
    }[]>>;
}
