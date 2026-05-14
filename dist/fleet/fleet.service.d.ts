import { PrismaService } from '../prisma/prisma.service';
import { FleetRealtimeGateway } from '../realtime/scoped-realtime.gateway';
export declare class FleetService {
    private readonly prisma;
    private readonly fleetRealtimeGateway;
    private readonly schoolOpsStore;
    constructor(prisma: PrismaService, fleetRealtimeGateway: FleetRealtimeGateway);
    getProfile(userId: string): Promise<{
        status: import(".prisma/client").$Enums.FleetPartnerStatus;
        companyName: string;
        contactEmail: string | null;
        contactPhone: string | null;
        registrationNumber: string | null;
        taxId: string | null;
        id: string;
        fleetId: string | null;
        userId: string;
        verticals: import("@prisma/client/runtime/client").JsonValue;
    }>;
    updateProfile(userId: string, patch: Partial<{
        companyName: string;
        contactEmail: string;
        contactPhone: string;
        registrationNumber?: string;
        taxId?: string;
    }>): Promise<{
        status: import(".prisma/client").$Enums.FleetPartnerStatus;
        companyName: string;
        contactEmail: string | null;
        contactPhone: string | null;
        registrationNumber: string | null;
        taxId: string | null;
        id: string;
        fleetId: string | null;
        userId: string;
        verticals: import("@prisma/client/runtime/client").JsonValue;
    }>;
    listBranches(userId: string): Promise<{
        phone: string | null;
        city: string | null;
        country: string | null;
        name: string;
        id: string;
        fleetId: string | null;
        fleetPartnerId: string;
        address: string | null;
        managerName: string | null;
        operatingHours: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    createBranch(userId: string, input: {
        name: string;
        address?: string;
        city?: string;
        country?: string;
        phone?: string;
        managerName?: string;
        operatingHours?: Record<string, unknown>;
    }): Promise<{
        phone: string | null;
        city: string | null;
        country: string | null;
        name: string;
        id: string;
        fleetId: string | null;
        fleetPartnerId: string;
        address: string | null;
        managerName: string | null;
        operatingHours: import("@prisma/client/runtime/client").JsonValue;
    }>;
    patchBranch(userId: string, branchId: string, patch: Partial<{
        name: string;
        address?: string;
        city?: string;
        country?: string;
        phone?: string;
        managerName?: string;
        operatingHours?: Record<string, unknown>;
    }>): Promise<{
        phone: string | null;
        city: string | null;
        country: string | null;
        name: string;
        id: string;
        fleetId: string | null;
        fleetPartnerId: string;
        address: string | null;
        managerName: string | null;
        operatingHours: import("@prisma/client/runtime/client").JsonValue;
    }>;
    deleteBranch(userId: string, branchId: string): Promise<{
        deleted: boolean;
    }>;
    listDrivers(userId: string): Promise<{
        email: string;
        phone: string;
        fullName: string;
        city: string | null;
        country: string | null;
        status: import(".prisma/client").$Enums.FleetDriverStatus;
        id: string;
        driverId: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        branchId: string | null;
        serviceModes: string[];
    }[]>;
    createDriver(userId: string, input: {
        fullName: string;
        email: string;
        phone: string;
        city?: string;
        country?: string;
        branchId?: string;
        serviceModes?: string[];
    }): Promise<{
        email: string;
        phone: string;
        fullName: string;
        city: string | null;
        country: string | null;
        status: import(".prisma/client").$Enums.FleetDriverStatus;
        id: string;
        driverId: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        branchId: string | null;
        serviceModes: string[];
    }>;
    patchDriver(userId: string, driverId: string, patch: Partial<{
        fullName: string;
        email: string;
        phone: string;
        city?: string;
        country?: string;
        branchId?: string;
        status: 'invited' | 'active' | 'suspended';
        serviceModes: string[];
    }>): Promise<{
        email: string;
        phone: string;
        fullName: string;
        city: string | null;
        country: string | null;
        status: import(".prisma/client").$Enums.FleetDriverStatus;
        id: string;
        driverId: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        branchId: string | null;
        serviceModes: string[];
    } | null>;
    listDispatches(userId: string, type?: string): Promise<{
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
    }[]>;
    createDispatch(userId: string, input: {
        driverId?: string;
        vehicleId?: string;
        type?: string;
        pickup: string;
        dropoff: string;
        notes?: string;
    }, forcedType?: string): Promise<{
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
    }>;
    listTrips(userId: string): Promise<{
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
    }[]>;
    listServices(userId: string, service: string): Promise<{
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
    }[]>;
    createService(userId: string, service: string, input: {
        customerName: string;
        assetId?: string;
        scheduledAt: number;
        notes?: string;
    }): Promise<{
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
    }>;
    getEarningsSummary(userId: string, period?: 'day' | 'week' | 'month' | 'quarter' | 'year'): Promise<{
        period: "day" | "week" | "month" | "quarter" | "year";
        total: number;
        currency: string;
        count: number;
    }>;
    getStatements(userId: string): Promise<{
        statementMonth: string;
        total: number;
        currency: string;
    }[]>;
    getPayouts(userId: string): Promise<{
        status: import(".prisma/client").$Enums.FleetPayoutStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
    }[]>;
    listComplianceIncidents(userId: string): Promise<{
        status: import(".prisma/client").$Enums.FleetComplianceStatus;
        description: string;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.FleetComplianceSeverity;
        category: string;
    }[]>;
    createComplianceIncident(userId: string, input: {
        category: string;
        severity: string;
        description: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.FleetComplianceStatus;
        description: string;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.FleetComplianceSeverity;
        category: string;
    }>;
    listTrainingCourses(userId: string): Promise<{
        status: import(".prisma/client").$Enums.FleetTrainingStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assignedTo: string | null;
    }[]>;
    createTrainingCourse(userId: string, input: {
        title: string;
        assignedTo?: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.FleetTrainingStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assignedTo: string | null;
    }>;
    listRiderServiceRequests(userId: string, query?: Partial<{
        serviceType: 'rental' | 'tour' | 'ambulance';
        status: string;
    }>): Promise<{
        id: string;
        riderId: string;
        driverId: string | null;
        serviceType: import(".prisma/client").$Enums.ServiceRequestType;
        status: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        createdAt: number;
        updatedAt: number;
    }[]>;
    getBranchById(userId: string, branchId: string): Promise<{
        phone: string | null;
        city: string | null;
        country: string | null;
        name: string;
        id: string;
        fleetId: string | null;
        fleetPartnerId: string;
        address: string | null;
        managerName: string | null;
        operatingHours: import("@prisma/client/runtime/client").JsonValue;
    }>;
    getDriverById(userId: string, driverId: string): Promise<{
        email: string;
        phone: string;
        fullName: string;
        city: string | null;
        country: string | null;
        status: import(".prisma/client").$Enums.FleetDriverStatus;
        id: string;
        driverId: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        branchId: string | null;
        serviceModes: string[];
    }>;
    deleteDriver(userId: string, driverId: string): Promise<{
        deleted: boolean;
    }>;
    removeVehicle(userId: string, vehicleId: string): Promise<{
        deleted: boolean;
    }>;
    listVehicleDocuments(userId: string, vehicleId: string): Promise<{
        documentType: string;
    }[]>;
    createVehicleDocument(userId: string, vehicleId: string, input: {
        documentType: string;
        fileUrl: string;
        expiryDate?: string;
    }): Promise<any>;
    listVehicleMaintenanceHistory(userId: string, vehicleId: string): Promise<any[]>;
    createVehicleMaintenanceRecord(userId: string, vehicleId: string, input: {
        title: string;
        notes?: string;
        cost?: number;
        servicedAt?: number;
    }): Promise<{
        id: string;
        title: string;
        notes: string | undefined;
        cost: number;
        servicedAt: number;
        createdAt: number;
    }>;
    getDispatchById(userId: string, dispatchId: string): Promise<{
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
    }>;
    patchDispatch(userId: string, dispatchId: string, patch: Partial<{
        pickup: string;
        dropoff: string;
        notes: string;
        status: string;
        driverId: string;
        vehicleId: string;
    }>): Promise<{
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
    }>;
    deleteDispatch(userId: string, dispatchId: string): Promise<{
        deleted: boolean;
    }>;
    assignDispatch(userId: string, dispatchId: string, input: {
        driverId?: string;
        vehicleId?: string;
    }): Promise<{
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
    }>;
    getServiceById(userId: string, service: string, serviceId: string): Promise<{
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
    }>;
    patchServiceById(userId: string, service: string, serviceId: string, patch: Partial<{
        customerName: string;
        assetId: string;
        scheduledAt: number;
        notes: string;
        status: string;
    }>): Promise<{
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
    }>;
    cancelServiceById(userId: string, service: string, serviceId: string, reason?: string): Promise<{
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
    }>;
    getComplianceIncidentById(userId: string, incidentId: string): Promise<{
        status: import(".prisma/client").$Enums.FleetComplianceStatus;
        description: string;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.FleetComplianceSeverity;
        category: string;
    }>;
    patchComplianceIncidentById(userId: string, incidentId: string, patch: Partial<{
        category: string;
        severity: string;
        status: string;
        description: string;
    }>): Promise<{
        status: import(".prisma/client").$Enums.FleetComplianceStatus;
        description: string;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.FleetComplianceSeverity;
        category: string;
    }>;
    getTrainingCourseById(userId: string, courseId: string): Promise<{
        status: import(".prisma/client").$Enums.FleetTrainingStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assignedTo: string | null;
    }>;
    patchTrainingCourseById(userId: string, courseId: string, patch: Partial<{
        title: string;
        status: string;
        assignedTo?: string;
    }>): Promise<{
        status: import(".prisma/client").$Enums.FleetTrainingStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        assignedTo: string | null;
    }>;
    deleteTrainingCourseById(userId: string, courseId: string): Promise<{
        deleted: boolean;
    }>;
    getStatementById(userId: string, statementId: string): Promise<{
        statementMonth: string;
        total: number;
        currency: string;
    }>;
    getPayoutById(userId: string, payoutId: string): Promise<{
        status: import(".prisma/client").$Enums.FleetPayoutStatus;
        id: string;
        fleetId: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
    }>;
    private getSchoolStore;
    schoolListRoutes(userId: string): Promise<Record<string, unknown>[]>;
    schoolCreateRoute(userId: string, input: Record<string, unknown>): Promise<{
        createdAt: number;
        updatedAt: number;
        id: string;
    }>;
    schoolGetRoute(userId: string, routeId: string): Promise<Record<string, unknown>>;
    schoolPatchRoute(userId: string, routeId: string, patch: Record<string, unknown>): Promise<Record<string, unknown>>;
    schoolDeleteRoute(userId: string, routeId: string): Promise<{
        deleted: boolean;
    }>;
    schoolListStudents(userId: string): Promise<Record<string, unknown>[]>;
    schoolCreateStudent(userId: string, input: Record<string, unknown>): Promise<{
        createdAt: number;
        updatedAt: number;
        id: string;
    }>;
    schoolGetStudent(userId: string, studentId: string): Promise<Record<string, unknown>>;
    schoolPatchStudent(userId: string, studentId: string, patch: Record<string, unknown>): Promise<Record<string, unknown>>;
    schoolDeleteStudent(userId: string, studentId: string): Promise<{
        deleted: boolean;
    }>;
    schoolListAttendance(userId: string, studentId?: string): Promise<Record<string, unknown>[]>;
    schoolUpsertAttendance(userId: string, input: Record<string, unknown>): Promise<{
        createdAt: number;
        updatedAt: number;
        id: string;
    }>;
    schoolListTrips(userId: string): Promise<Record<string, unknown>[]>;
    schoolCreateTrip(userId: string, input: Record<string, unknown>): Promise<{
        createdAt: number;
        updatedAt: number;
        id: string;
        status: string;
    }>;
    schoolGetTrip(userId: string, tripId: string): Promise<Record<string, unknown>>;
    schoolPatchTrip(userId: string, tripId: string, patch: Record<string, unknown>): Promise<Record<string, unknown>>;
    schoolCancelTrip(userId: string, tripId: string, reason?: string): Promise<Record<string, unknown>>;
    schoolTripLive(userId: string, tripId: string): Promise<{
        tripId: string;
        status: unknown;
        vehicleLocation: {
            lat: number;
            lng: number;
        };
        updatedAt: number;
    }>;
    schoolListAttendants(userId: string): Promise<Record<string, unknown>[]>;
    schoolCreateAttendant(userId: string, input: Record<string, unknown>): Promise<{
        createdAt: number;
        updatedAt: number;
        id: string;
    }>;
    schoolGetAttendant(userId: string, attendantId: string): Promise<Record<string, unknown>>;
    schoolPatchAttendant(userId: string, attendantId: string, patch: Record<string, unknown>): Promise<Record<string, unknown>>;
    schoolDeleteAttendant(userId: string, attendantId: string): Promise<{
        deleted: boolean;
    }>;
    schoolListPayments(userId: string): Promise<Record<string, unknown>[]>;
    schoolCreatePayment(userId: string, input: Record<string, unknown>): Promise<{
        createdAt: number;
        id: string;
    }>;
    schoolListFeedback(userId: string): Promise<Record<string, unknown>[]>;
    schoolCreateFeedback(userId: string, input: Record<string, unknown>): Promise<{
        createdAt: number;
        id: string;
    }>;
    schoolRoster(userId: string, routeId?: string): Promise<Record<string, unknown>[]>;
    schoolTripCalendar(userId: string, date?: string): Promise<Record<string, unknown>[]>;
    schoolPerformanceReport(userId: string): Promise<{
        tripsTotal: number;
        tripsCompleted: number;
        onTimeRate: number;
        attendanceEntries: number;
    }>;
    schoolBulkReminders(userId: string, input: {
        message: string;
        target?: string;
    }): Promise<{
        sent: boolean;
        message: string;
        target: string;
        sentAt: number;
    }>;
    private publishFleetSyncEvent;
    private getFleetId;
    private ensureBranchBelongsToFleet;
    private ensureFleetDriver;
    private ensureFleetVehicle;
    private getFleetEarningsEvents;
}
