import { Repository } from 'typeorm';
import { FleetPartnerProfile } from '../entities/fleet-partner-profile.entity';
import { FleetBranch } from '../entities/fleet-branch.entity';
import { FleetDriver } from '../entities/fleet-driver.entity';
import { FleetDispatch } from '../entities/fleet-dispatch.entity';
import { FleetServiceRecord } from '../entities/fleet-service-record.entity';
import { FleetPayout } from '../entities/fleet-payout.entity';
import { FleetComplianceIncident } from '../entities/fleet-compliance-incident.entity';
import { FleetTrainingCourse } from '../entities/fleet-training-course.entity';
import { User } from '../entities/user.entity';
import { DriverProfile } from '../entities/driver-profile.entity';
import { Trip } from '../entities/trip.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { RiderServiceRequest } from '../entities/rider-service-request.entity';
import { FleetRealtimeGateway } from '../realtime/scoped-realtime.gateway';
export declare class FleetService {
    private fleetProfileRepo;
    private fleetBranchRepo;
    private fleetDriverRepo;
    private fleetDispatchRepo;
    private fleetServiceRepo;
    private fleetPayoutRepo;
    private complianceRepo;
    private trainingRepo;
    private userRepo;
    private driverProfileRepo;
    private tripRepo;
    private jobOfferRepo;
    private earningsLedgerRepo;
    private vehicleRepo;
    private riderServiceRequestRepo;
    private readonly fleetRealtimeGateway;
    private readonly schoolOpsStore;
    constructor(fleetProfileRepo: Repository<FleetPartnerProfile>, fleetBranchRepo: Repository<FleetBranch>, fleetDriverRepo: Repository<FleetDriver>, fleetDispatchRepo: Repository<FleetDispatch>, fleetServiceRepo: Repository<FleetServiceRecord>, fleetPayoutRepo: Repository<FleetPayout>, complianceRepo: Repository<FleetComplianceIncident>, trainingRepo: Repository<FleetTrainingCourse>, userRepo: Repository<User>, driverProfileRepo: Repository<DriverProfile>, tripRepo: Repository<Trip>, jobOfferRepo: Repository<JobOffer>, earningsLedgerRepo: Repository<EarningsLedger>, vehicleRepo: Repository<Vehicle>, riderServiceRequestRepo: Repository<RiderServiceRequest>, fleetRealtimeGateway: FleetRealtimeGateway);
    getProfile(userId: string): Promise<FleetPartnerProfile>;
    updateProfile(userId: string, patch: Partial<{
        companyName: string;
        contactEmail: string;
        contactPhone: string;
        registrationNumber?: string;
        taxId?: string;
    }>): Promise<FleetPartnerProfile>;
    listBranches(userId: string): Promise<FleetBranch[]>;
    createBranch(userId: string, input: {
        name: string;
        address?: string;
        city?: string;
        country?: string;
        phone?: string;
        managerName?: string;
        operatingHours?: Record<string, unknown>;
    }): Promise<FleetBranch>;
    patchBranch(userId: string, branchId: string, patch: Partial<{
        name: string;
        address?: string;
        city?: string;
        country?: string;
        phone?: string;
        managerName?: string;
        operatingHours?: Record<string, unknown>;
    }>): Promise<FleetBranch>;
    deleteBranch(userId: string, branchId: string): Promise<{
        deleted: boolean;
    }>;
    listDrivers(userId: string): Promise<FleetDriver[]>;
    createDriver(userId: string, input: {
        fullName: string;
        email: string;
        phone: string;
        city?: string;
        country?: string;
        branchId?: string;
        serviceModes?: string[];
    }): Promise<FleetDriver>;
    patchDriver(userId: string, driverId: string, patch: Partial<{
        fullName: string;
        email: string;
        phone: string;
        city?: string;
        country?: string;
        branchId?: string;
        status: 'invited' | 'active' | 'suspended';
        serviceModes: string[];
    }>): Promise<FleetDriver>;
    listDispatches(userId: string, type?: string): Promise<FleetDispatch[]>;
    createDispatch(userId: string, input: {
        driverId?: string;
        vehicleId?: string;
        type?: string;
        pickup: string;
        dropoff: string;
        notes?: string;
    }, forcedType?: string): Promise<{
        dispatch: FleetDispatch;
        trip: Trip;
    }>;
    listTrips(userId: string): Promise<Trip[]>;
    listServices(userId: string, service: string): Promise<FleetServiceRecord[]>;
    createService(userId: string, service: string, input: {
        customerName: string;
        assetId?: string;
        scheduledAt: number;
        notes?: string;
    }): Promise<FleetServiceRecord>;
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
    getPayouts(userId: string): Promise<FleetPayout[]>;
    listComplianceIncidents(userId: string): Promise<FleetComplianceIncident[]>;
    createComplianceIncident(userId: string, input: {
        category: string;
        severity: string;
        description: string;
    }): Promise<FleetComplianceIncident>;
    listTrainingCourses(userId: string): Promise<FleetTrainingCourse[]>;
    createTrainingCourse(userId: string, input: {
        title: string;
        assignedTo?: string;
    }): Promise<FleetTrainingCourse>;
    listRiderServiceRequests(userId: string, query?: Partial<{
        serviceType: 'rental' | 'tour' | 'ambulance';
        status: string;
    }>): Promise<{
        id: string;
        riderId: string;
        driverId: string;
        serviceType: "rental" | "tour" | "ambulance";
        status: string;
        payload: Record<string, any>;
        createdAt: number;
        updatedAt: number;
    }[]>;
    getBranchById(userId: string, branchId: string): Promise<FleetBranch>;
    getDriverById(userId: string, driverId: string): Promise<FleetDriver>;
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
    getDispatchById(userId: string, dispatchId: string): Promise<FleetDispatch>;
    patchDispatch(userId: string, dispatchId: string, patch: Partial<{
        pickup: string;
        dropoff: string;
        notes: string;
        status: string;
        driverId: string;
        vehicleId: string;
    }>): Promise<FleetDispatch>;
    deleteDispatch(userId: string, dispatchId: string): Promise<{
        deleted: boolean;
    }>;
    assignDispatch(userId: string, dispatchId: string, input: {
        driverId?: string;
        vehicleId?: string;
    }): Promise<FleetDispatch>;
    getServiceById(userId: string, service: string, serviceId: string): Promise<FleetServiceRecord>;
    patchServiceById(userId: string, service: string, serviceId: string, patch: Partial<{
        customerName: string;
        assetId: string;
        scheduledAt: number;
        notes: string;
        status: string;
    }>): Promise<FleetServiceRecord>;
    cancelServiceById(userId: string, service: string, serviceId: string, reason?: string): Promise<FleetServiceRecord>;
    getComplianceIncidentById(userId: string, incidentId: string): Promise<FleetComplianceIncident>;
    patchComplianceIncidentById(userId: string, incidentId: string, patch: Partial<{
        category: string;
        severity: string;
        status: string;
        description: string;
    }>): Promise<FleetComplianceIncident>;
    getTrainingCourseById(userId: string, courseId: string): Promise<FleetTrainingCourse>;
    patchTrainingCourseById(userId: string, courseId: string, patch: Partial<{
        title: string;
        status: string;
        assignedTo?: string;
    }>): Promise<FleetTrainingCourse>;
    deleteTrainingCourseById(userId: string, courseId: string): Promise<{
        deleted: boolean;
    }>;
    getStatementById(userId: string, statementId: string): Promise<{
        statementMonth: string;
        total: number;
        currency: string;
    }>;
    getPayoutById(userId: string, payoutId: string): Promise<FleetPayout>;
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
