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
    private publishFleetSyncEvent;
    private getFleetId;
    private ensureBranchBelongsToFleet;
    private ensureFleetDriver;
    private ensureFleetVehicle;
    private getFleetEarningsEvents;
}
