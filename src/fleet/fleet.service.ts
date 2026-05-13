import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between, MoreThanOrEqual } from 'typeorm';
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
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FleetService {
  constructor(
    @InjectRepository(FleetPartnerProfile) private fleetProfileRepo: Repository<FleetPartnerProfile>,
    @InjectRepository(FleetBranch) private fleetBranchRepo: Repository<FleetBranch>,
    @InjectRepository(FleetDriver) private fleetDriverRepo: Repository<FleetDriver>,
    @InjectRepository(FleetDispatch) private fleetDispatchRepo: Repository<FleetDispatch>,
    @InjectRepository(FleetServiceRecord) private fleetServiceRepo: Repository<FleetServiceRecord>,
    @InjectRepository(FleetPayout) private fleetPayoutRepo: Repository<FleetPayout>,
    @InjectRepository(FleetComplianceIncident) private complianceRepo: Repository<FleetComplianceIncident>,
    @InjectRepository(FleetTrainingCourse) private trainingRepo: Repository<FleetTrainingCourse>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(DriverProfile) private driverProfileRepo: Repository<DriverProfile>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(JobOffer) private jobOfferRepo: Repository<JobOffer>,
    @InjectRepository(EarningsLedger) private earningsLedgerRepo: Repository<EarningsLedger>,
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(RiderServiceRequest) private riderServiceRequestRepo: Repository<RiderServiceRequest>,
    private readonly fleetRealtimeGateway: FleetRealtimeGateway,
  ) {}

  async getProfile(userId: string) {
    const fleetId = await this.getFleetId(userId);
    const profile = await this.fleetProfileRepo.findOne({ where: { fleetId } });
    if (!profile) {
      throw new NotFoundException('Fleet profile not found');
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    patch: Partial<{
      companyName: string;
      contactEmail: string;
      contactPhone: string;
      registrationNumber?: string;
      taxId?: string;
    }>,
  ) {
    const profile = await this.getProfile(userId);
    Object.assign(profile, patch);
    return this.fleetProfileRepo.save(profile);
  }

  async listBranches(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.fleetBranchRepo.find({ where: { fleetId } });
  }

  async createBranch(
    userId: string,
    input: {
      name: string;
      address?: string;
      city?: string;
      country?: string;
      phone?: string;
      managerName?: string;
      operatingHours?: Record<string, unknown>;
    },
  ) {
    const fleetId = await this.getFleetId(userId);
    const branch = this.fleetBranchRepo.create({
      fleetId,
      ...input,
    });
    return this.fleetBranchRepo.save(branch);
  }

  async patchBranch(
    userId: string,
    branchId: string,
    patch: Partial<{
      name: string;
      address?: string;
      city?: string;
      country?: string;
      phone?: string;
      managerName?: string;
      operatingHours?: Record<string, unknown>;
    }>,
  ) {
    const fleetId = await this.getFleetId(userId);
    const branch = await this.fleetBranchRepo.findOne({ where: { id: branchId, fleetId } });
    if (!branch) {
      throw new NotFoundException('Fleet branch not found');
    }
    Object.assign(branch, patch);
    return this.fleetBranchRepo.save(branch);
  }

  async deleteBranch(userId: string, branchId: string) {
    const fleetId = await this.getFleetId(userId);
    const result = await this.fleetBranchRepo.delete({ id: branchId, fleetId });
    if (result.affected === 0) {
      throw new NotFoundException('Fleet branch not found');
    }
    return { deleted: true };
  }

  async listDrivers(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.fleetDriverRepo.find({ where: { fleetId } });
  }

  async createDriver(
    userId: string,
    input: {
      fullName: string;
      email: string;
      phone: string;
      city?: string;
      country?: string;
      branchId?: string;
      serviceModes?: string[];
    },
  ) {
    const fleetId = await this.getFleetId(userId);
    await this.ensureBranchBelongsToFleet(fleetId, input.branchId);

    const driverId = uuidv4();
    const userRecordId = uuidv4();

    const user = this.userRepo.create({
      id: userRecordId,
      email: input.email,
      password: 'password123',
      phone: input.phone,
      roles: ['driver'],
      status: 'active',
      driverId,
    });
    await this.userRepo.save(user);

    const profile = this.driverProfileRepo.create({
      driverId,
      fleetId,
      branchId: input.branchId,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      city: input.city ?? 'Kampala',
      country: input.country ?? 'Uganda',
      onboardingStatus: 'incomplete',
      preferences: {
        areaIds: [],
        serviceIds: input.serviceModes ?? ['ride'],
        requirementIds: [],
      },
      checkpoints: {
        roleSelected: true,
        documentsVerified: false,
        identityVerified: false,
        vehicleReady: false,
        emergencyContactReady: false,
        trainingCompleted: false,
      },
    });
    await this.driverProfileRepo.save(profile);

    const fleetDriver = this.fleetDriverRepo.create({
      fleetId,
      userId: userRecordId,
      driverId,
      branchId: input.branchId,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      city: input.city,
      country: input.country,
      status: 'invited',
      serviceModes: input.serviceModes ?? ['ride'],
    });

    return this.fleetDriverRepo.save(fleetDriver);
  }

  async patchDriver(
    userId: string,
    driverId: string,
    patch: Partial<{
      fullName: string;
      email: string;
      phone: string;
      city?: string;
      country?: string;
      branchId?: string;
      status: 'invited' | 'active' | 'suspended';
      serviceModes: string[];
    }>,
  ) {
    const fleetId = await this.getFleetId(userId);
    await this.ensureBranchBelongsToFleet(fleetId, patch.branchId);

    const fleetDriver = await this.fleetDriverRepo.findOne({ where: { driverId, fleetId } });
    if (!fleetDriver) {
      throw new NotFoundException('Fleet driver not found');
    }

    Object.assign(fleetDriver, patch);
    await this.fleetDriverRepo.save(fleetDriver);

    const profile = await this.driverProfileRepo.findOne({ where: { driverId } });
    if (profile) {
      profile.branchId = patch.branchId ?? profile.branchId;
      profile.fullName = patch.fullName ?? profile.fullName;
      profile.email = patch.email ?? profile.email;
      profile.phone = patch.phone ?? profile.phone;
      profile.city = patch.city ?? profile.city;
      profile.country = patch.country ?? profile.country;
      if (patch.serviceModes) {
        profile.preferences = { ...profile.preferences, serviceIds: patch.serviceModes };
      }
      await this.driverProfileRepo.save(profile);
    }

    const user = await this.userRepo.findOne({ where: { driverId } });
    if (user) {
      user.email = patch.email ?? user.email;
      user.phone = patch.phone ?? user.phone;
      await this.userRepo.save(user);
    }

    return fleetDriver;
  }

  async listDispatches(userId: string, type?: string) {
    const fleetId = await this.getFleetId(userId);
    const where: any = { fleetId };
    if (type) where.type = type;
    return this.fleetDispatchRepo.find({ where });
  }

  async createDispatch(
    userId: string,
    input: {
      driverId?: string;
      vehicleId?: string;
      type?: string;
      pickup: string;
      dropoff: string;
      notes?: string;
    },
    forcedType?: string,
  ) {
    const fleetId = await this.getFleetId(userId);
    const type = forcedType ?? input.type ?? 'ride';

    await this.ensureFleetDriver(fleetId, input.driverId);
    await this.ensureFleetVehicle(fleetId, input.vehicleId);

    const tripId = uuidv4();
    const dispatch = this.fleetDispatchRepo.create({
      fleetId,
      type,
      status: input.driverId ? 'assigned' : 'pending',
      driverId: input.driverId,
      vehicleId: input.vehicleId,
      tripId,
      pickup: input.pickup,
      dropoff: input.dropoff,
      notes: input.notes,
    });

    const trip = this.tripRepo.create({
      id: tripId,
      riderId: `fleet:${fleetId}`,
      driverId: input.driverId,
      fleetId,
      type: type as any,
      status: 'requested',
      pickup: input.pickup,
      dropoff: input.dropoff,
      pickupLocation: { lat: 0, lng: 0 },
      dropoffLocation: { lat: 0, lng: 0 },
      otpCode: String(Math.floor(1000 + Math.random() * 9000)),
    });

    const savedDispatch = await this.fleetDispatchRepo.save(dispatch);
    await this.tripRepo.save(trip);

    if (input.driverId) {
      const job = this.jobOfferRepo.create({
        driverId: input.driverId,
        riderId: trip.riderId,
        tripId,
        type: type as any,
        status: 'offered',
        pickup: input.pickup,
        dropoff: input.dropoff,
        pickupLocation: { lat: 0, lng: 0 },
        dropoffLocation: { lat: 0, lng: 0 },
      });
      await this.jobOfferRepo.save(job);
    }

    this.publishFleetSyncEvent(userId, 'dispatch.created', {
      dispatchId: savedDispatch.id,
      tripId,
      fleetId,
      status: savedDispatch.status,
      type,
      timestamp: Date.now(),
    });

    return { dispatch: savedDispatch, trip };
  }

  async listTrips(userId: string) {
    const fleetId = await this.getFleetId(userId);
    // Find trips where fleetId matches OR driver is one of our fleet drivers
    const drivers = await this.fleetDriverRepo.find({ where: { fleetId } });
    const driverIds = drivers.map(d => d.driverId);
    
    return this.tripRepo.find({
      where: [
        { fleetId },
        { driverId: In(driverIds) }
      ]
    });
  }

  async listServices(userId: string, service: string) {
    const fleetId = await this.getFleetId(userId);
    return this.fleetServiceRepo.find({ where: { fleetId, service } });
  }

  async createService(
    userId: string,
    service: string,
    input: { customerName: string; assetId?: string; scheduledAt: number; notes?: string },
  ) {
    const fleetId = await this.getFleetId(userId);
    await this.ensureFleetVehicle(fleetId, input.assetId);

    const record = this.fleetServiceRepo.create({
      fleetId,
      service,
      status: 'pending',
      customerName: input.customerName,
      assetId: input.assetId,
      scheduledAt: input.scheduledAt,
      notes: input.notes,
    });
    return this.fleetServiceRepo.save(record);
  }

  async getEarningsSummary(userId: string, period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'week') {
    const fleetId = await this.getFleetId(userId);
    const events = await this.getFleetEarningsEvents(fleetId, period);
    return {
      period,
      total: events.reduce((sum, item) => sum + Number(item.amount), 0),
      currency: 'UGX',
      count: events.length,
    };
  }

  async getStatements(userId: string) {
    const fleetId = await this.getFleetId(userId);
    const events = await this.getFleetEarningsEvents(fleetId);
    const grouped = new Map<string, number>();

    for (const event of events) {
      const statementKey = new Date(event.createdAt).toISOString().slice(0, 7);
      grouped.set(statementKey, (grouped.get(statementKey) ?? 0) + Number(event.amount));
    }

    return Array.from(grouped.entries()).map(([statementMonth, total]) => ({
      statementMonth,
      total,
      currency: 'UGX',
    }));
  }

  async getPayouts(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.fleetPayoutRepo.find({ where: { fleetId } });
  }

  async listComplianceIncidents(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.complianceRepo.find({ where: { fleetId } });
  }

  async createComplianceIncident(
    userId: string,
    input: { category: string; severity: string; description: string },
  ) {
    const fleetId = await this.getFleetId(userId);
    const incident = this.complianceRepo.create({
      fleetId,
      category: input.category,
      severity: input.severity,
      status: 'open',
      description: input.description,
    });
    const saved = await this.complianceRepo.save(incident);
    this.publishFleetSyncEvent(userId, 'fleet.alert', {
      alertType: 'compliance.incident.created',
      incidentId: saved.id,
      severity: saved.severity,
      status: saved.status,
      timestamp: Date.now(),
    });
    return saved;
  }

  async listTrainingCourses(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.trainingRepo.find({ where: { fleetId } });
  }

  async createTrainingCourse(userId: string, input: { title: string; assignedTo?: string }) {
    const fleetId = await this.getFleetId(userId);
    await this.ensureFleetDriver(fleetId, input.assignedTo);

    const course = this.trainingRepo.create({
      fleetId,
      title: input.title,
      status: 'draft',
      assignedTo: input.assignedTo,
    });
    const saved = await this.trainingRepo.save(course);
    this.publishFleetSyncEvent(userId, 'fleet.alert', {
      alertType: 'compliance.training.created',
      courseId: saved.id,
      status: saved.status,
      timestamp: Date.now(),
    });
    return saved;
  }

  async listRiderServiceRequests(
    userId: string,
    query: Partial<{ serviceType: 'rental' | 'tour' | 'ambulance'; status: string }> = {},
  ) {
    await this.getFleetId(userId);
    const where: any = {};
    if (query.serviceType) where.serviceType = query.serviceType;
    if (query.status) where.status = query.status;

    const records = await this.riderServiceRequestRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return records.map((record) => ({
      id: record.id,
      riderId: record.riderId,
      driverId: record.driverId,
      serviceType: record.serviceType,
      status: record.status,
      payload: record.payload,
      createdAt: new Date(record.createdAt).getTime(),
      updatedAt: new Date(record.updatedAt).getTime(),
    }));
  }

  private publishFleetSyncEvent(userId: string, event: string, payload: Record<string, unknown>) {
    this.fleetRealtimeGateway.publishToUser(userId, event, payload);
    this.fleetRealtimeGateway.publishToUser(userId, 'notification.new', payload);
  }

  private async getFleetId(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return user?.fleetId ?? userId;
  }

  private async ensureBranchBelongsToFleet(fleetId: string, branchId?: string) {
    if (!branchId) return;
    const branch = await this.fleetBranchRepo.findOne({ where: { id: branchId, fleetId } });
    if (!branch) {
      throw new BadRequestException('Branch does not belong to this fleet');
    }
  }

  private async ensureFleetDriver(fleetId: string, driverId?: string) {
    if (!driverId) return;
    const driver = await this.fleetDriverRepo.findOne({ where: { fleetId, driverId } });
    if (!driver) {
      throw new BadRequestException('Driver does not belong to this fleet');
    }
  }

  private async ensureFleetVehicle(fleetId: string, vehicleId?: string) {
    if (!vehicleId) return;
    const vehicle = await this.vehicleRepo.findOne({ where: { fleetId, id: vehicleId } });
    if (!vehicle) {
      throw new BadRequestException('Vehicle does not belong to this fleet');
    }
  }

  private async getFleetEarningsEvents(fleetId: string, period?: 'day' | 'week' | 'month' | 'quarter' | 'year') {
    const drivers = await this.fleetDriverRepo.find({ where: { fleetId } });
    const driverIds = drivers.map(d => d.driverId);
    
    const now = new Date();
    let threshold: Date | null = null;
    
    if (period) {
      threshold = new Date();
      if (period === 'day') threshold.setDate(now.getDate() - 1);
      else if (period === 'week') threshold.setDate(now.getDate() - 7);
      else if (period === 'month') threshold.setMonth(now.getMonth() - 1);
      else if (period === 'quarter') threshold.setMonth(now.getMonth() - 3);
      else if (period === 'year') threshold.setFullYear(now.getFullYear() - 1);
    }

    const where: any = [
      { userId: In(driverIds) }
    ];
    
    // TypeORM multiple where clauses are ORed. We need (fleetId OR driverId) AND createdAt >= threshold.
    // This is a bit tricky with find option.
    // Better to use QueryBuilder for complex logic, but let's try to keep it simple.
    
    if (threshold) {
      // We'd need to apply threshold to each OR branch
      return this.earningsLedgerRepo.find({
        where: [
          { userId: In(driverIds), createdAt: MoreThanOrEqual(threshold) }
        ]
      });
    }

    return this.earningsLedgerRepo.find({
      where: [
        { userId: In(driverIds) }
      ]
    });
  }
}
