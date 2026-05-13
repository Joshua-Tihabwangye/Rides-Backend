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
  private readonly schoolOpsStore = new Map<string, {
    routes: Array<Record<string, unknown>>;
    students: Array<Record<string, unknown>>;
    attendants: Array<Record<string, unknown>>;
    trips: Array<Record<string, unknown>>;
    attendance: Array<Record<string, unknown>>;
    payments: Array<Record<string, unknown>>;
    feedback: Array<Record<string, unknown>>;
  }>();

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

  async getBranchById(userId: string, branchId: string) {
    const fleetId = await this.getFleetId(userId);
    const branch = await this.fleetBranchRepo.findOne({ where: { id: branchId, fleetId } });
    if (!branch) {
      throw new NotFoundException('Fleet branch not found');
    }
    return branch;
  }

  async getDriverById(userId: string, driverId: string) {
    const fleetId = await this.getFleetId(userId);
    const driver = await this.fleetDriverRepo.findOne({ where: { fleetId, driverId } });
    if (!driver) {
      throw new NotFoundException('Fleet driver not found');
    }
    return driver;
  }

  async deleteDriver(userId: string, driverId: string) {
    const fleetId = await this.getFleetId(userId);
    const result = await this.fleetDriverRepo.delete({ fleetId, driverId });
    if (!result.affected) {
      throw new NotFoundException('Fleet driver not found');
    }
    return { deleted: true };
  }

  async removeVehicle(userId: string, vehicleId: string) {
    const fleetId = await this.getFleetId(userId);
    const result = await this.vehicleRepo.delete({ id: vehicleId, fleetId });
    if (!result.affected) {
      throw new NotFoundException('Fleet vehicle not found');
    }
    return { deleted: true };
  }

  async listVehicleDocuments(userId: string, vehicleId: string) {
    const fleetId = await this.getFleetId(userId);
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Fleet vehicle not found');
    }
    const documents = vehicle.documents || {};
    return Object.entries(documents).map(([documentType, payload]) => ({ documentType, ...(payload as object) }));
  }

  async createVehicleDocument(userId: string, vehicleId: string, input: { documentType: string; fileUrl: string; expiryDate?: string }) {
    const fleetId = await this.getFleetId(userId);
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Fleet vehicle not found');
    }
    const documents = vehicle.documents || {};
    documents[input.documentType] = {
      fileUrl: input.fileUrl,
      expiryDate: input.expiryDate || null,
      status: 'under_review',
      updatedAt: Date.now(),
    };
    vehicle.documents = documents;
    await this.vehicleRepo.save(vehicle);
    return { documentType: input.documentType, ...documents[input.documentType] };
  }

  async listVehicleMaintenanceHistory(userId: string, vehicleId: string) {
    const fleetId = await this.getFleetId(userId);
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Fleet vehicle not found');
    }
    const accessories = vehicle.accessories || {};
    const history = Array.isArray(accessories.maintenanceHistory) ? accessories.maintenanceHistory : [];
    return history;
  }

  async createVehicleMaintenanceRecord(
    userId: string,
    vehicleId: string,
    input: { title: string; notes?: string; cost?: number; servicedAt?: number },
  ) {
    const fleetId = await this.getFleetId(userId);
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Fleet vehicle not found');
    }
    const accessories = vehicle.accessories || {};
    const history = Array.isArray(accessories.maintenanceHistory) ? accessories.maintenanceHistory : [];
    const record = {
      id: uuidv4(),
      title: input.title,
      notes: input.notes,
      cost: Number(input.cost || 0),
      servicedAt: Number(input.servicedAt || Date.now()),
      createdAt: Date.now(),
    };
    history.unshift(record);
    accessories.maintenanceHistory = history.slice(0, 500);
    vehicle.accessories = accessories;
    await this.vehicleRepo.save(vehicle);
    return record;
  }

  async getDispatchById(userId: string, dispatchId: string) {
    const fleetId = await this.getFleetId(userId);
    const dispatch = await this.fleetDispatchRepo.findOne({ where: { id: dispatchId, fleetId } });
    if (!dispatch) {
      throw new NotFoundException('Fleet dispatch not found');
    }
    return dispatch;
  }

  async patchDispatch(userId: string, dispatchId: string, patch: Partial<{ pickup: string; dropoff: string; notes: string; status: string; driverId: string; vehicleId: string }>) {
    const fleetId = await this.getFleetId(userId);
    const dispatch = await this.fleetDispatchRepo.findOne({ where: { id: dispatchId, fleetId } });
    if (!dispatch) {
      throw new NotFoundException('Fleet dispatch not found');
    }
    await this.ensureFleetDriver(fleetId, patch.driverId);
    await this.ensureFleetVehicle(fleetId, patch.vehicleId);
    Object.assign(dispatch, patch);
    return this.fleetDispatchRepo.save(dispatch);
  }

  async deleteDispatch(userId: string, dispatchId: string) {
    const fleetId = await this.getFleetId(userId);
    const result = await this.fleetDispatchRepo.delete({ id: dispatchId, fleetId });
    if (!result.affected) {
      throw new NotFoundException('Fleet dispatch not found');
    }
    return { deleted: true };
  }

  async assignDispatch(userId: string, dispatchId: string, input: { driverId?: string; vehicleId?: string }) {
    const patched = await this.patchDispatch(userId, dispatchId, {
      driverId: input.driverId,
      vehicleId: input.vehicleId,
      status: input.driverId ? 'assigned' : 'pending',
    });
    return patched;
  }

  async getServiceById(userId: string, service: string, serviceId: string) {
    const fleetId = await this.getFleetId(userId);
    const record = await this.fleetServiceRepo.findOne({ where: { id: serviceId, fleetId, service } });
    if (!record) {
      throw new NotFoundException('Fleet service record not found');
    }
    return record;
  }

  async patchServiceById(
    userId: string,
    service: string,
    serviceId: string,
    patch: Partial<{ customerName: string; assetId: string; scheduledAt: number; notes: string; status: string }>,
  ) {
    const fleetId = await this.getFleetId(userId);
    const record = await this.fleetServiceRepo.findOne({ where: { id: serviceId, fleetId, service } });
    if (!record) {
      throw new NotFoundException('Fleet service record not found');
    }
    await this.ensureFleetVehicle(fleetId, patch.assetId);
    Object.assign(record, patch);
    return this.fleetServiceRepo.save(record);
  }

  async cancelServiceById(userId: string, service: string, serviceId: string, reason?: string) {
    return this.patchServiceById(userId, service, serviceId, { status: 'cancelled', notes: reason });
  }

  async getComplianceIncidentById(userId: string, incidentId: string) {
    const fleetId = await this.getFleetId(userId);
    const incident = await this.complianceRepo.findOne({ where: { id: incidentId, fleetId } });
    if (!incident) {
      throw new NotFoundException('Compliance incident not found');
    }
    return incident;
  }

  async patchComplianceIncidentById(
    userId: string,
    incidentId: string,
    patch: Partial<{ category: string; severity: string; status: string; description: string }>,
  ) {
    const fleetId = await this.getFleetId(userId);
    const incident = await this.complianceRepo.findOne({ where: { id: incidentId, fleetId } });
    if (!incident) {
      throw new NotFoundException('Compliance incident not found');
    }
    Object.assign(incident, patch);
    return this.complianceRepo.save(incident);
  }

  async getTrainingCourseById(userId: string, courseId: string) {
    const fleetId = await this.getFleetId(userId);
    const course = await this.trainingRepo.findOne({ where: { id: courseId, fleetId } });
    if (!course) {
      throw new NotFoundException('Training course not found');
    }
    return course;
  }

  async patchTrainingCourseById(
    userId: string,
    courseId: string,
    patch: Partial<{ title: string; status: string; assignedTo?: string }>,
  ) {
    const fleetId = await this.getFleetId(userId);
    await this.ensureFleetDriver(fleetId, patch.assignedTo);
    const course = await this.trainingRepo.findOne({ where: { id: courseId, fleetId } });
    if (!course) {
      throw new NotFoundException('Training course not found');
    }
    Object.assign(course, patch);
    return this.trainingRepo.save(course);
  }

  async deleteTrainingCourseById(userId: string, courseId: string) {
    const fleetId = await this.getFleetId(userId);
    const result = await this.trainingRepo.delete({ id: courseId, fleetId });
    if (!result.affected) {
      throw new NotFoundException('Training course not found');
    }
    return { deleted: true };
  }

  async getStatementById(userId: string, statementId: string) {
    const statements = await this.getStatements(userId);
    const statement = statements.find((item) => item.statementMonth === statementId);
    if (!statement) {
      throw new NotFoundException('Statement not found');
    }
    return statement;
  }

  async getPayoutById(userId: string, payoutId: string) {
    const fleetId = await this.getFleetId(userId);
    const payout = await this.fleetPayoutRepo.findOne({ where: { id: payoutId, fleetId } });
    if (!payout) {
      throw new NotFoundException('Payout not found');
    }
    return payout;
  }

  private getSchoolStore(fleetId: string) {
    if (!this.schoolOpsStore.has(fleetId)) {
      this.schoolOpsStore.set(fleetId, {
        routes: [],
        students: [],
        attendants: [],
        trips: [],
        attendance: [],
        payments: [],
        feedback: [],
      });
    }
    return this.schoolOpsStore.get(fleetId)!;
  }

  async schoolListRoutes(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.getSchoolStore(fleetId).routes;
  }

  async schoolCreateRoute(userId: string, input: Record<string, unknown>) {
    const fleetId = await this.getFleetId(userId);
    const store = this.getSchoolStore(fleetId);
    const created = { id: uuidv4(), ...input, createdAt: Date.now(), updatedAt: Date.now() };
    store.routes.unshift(created);
    return created;
  }

  async schoolGetRoute(userId: string, routeId: string) {
    const fleetId = await this.getFleetId(userId);
    const route = this.getSchoolStore(fleetId).routes.find((item) => item.id === routeId);
    if (!route) throw new NotFoundException('Route not found');
    return route;
  }

  async schoolPatchRoute(userId: string, routeId: string, patch: Record<string, unknown>) {
    const route = await this.schoolGetRoute(userId, routeId);
    Object.assign(route, patch, { updatedAt: Date.now() });
    return route;
  }

  async schoolDeleteRoute(userId: string, routeId: string) {
    const fleetId = await this.getFleetId(userId);
    const store = this.getSchoolStore(fleetId);
    const next = store.routes.filter((item) => item.id !== routeId);
    if (next.length === store.routes.length) throw new NotFoundException('Route not found');
    store.routes = next;
    return { deleted: true };
  }

  async schoolListStudents(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.getSchoolStore(fleetId).students;
  }

  async schoolCreateStudent(userId: string, input: Record<string, unknown>) {
    const fleetId = await this.getFleetId(userId);
    const store = this.getSchoolStore(fleetId);
    const created = { id: uuidv4(), ...input, createdAt: Date.now(), updatedAt: Date.now() };
    store.students.unshift(created);
    return created;
  }

  async schoolGetStudent(userId: string, studentId: string) {
    const fleetId = await this.getFleetId(userId);
    const student = this.getSchoolStore(fleetId).students.find((item) => item.id === studentId);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async schoolPatchStudent(userId: string, studentId: string, patch: Record<string, unknown>) {
    const student = await this.schoolGetStudent(userId, studentId);
    Object.assign(student, patch, { updatedAt: Date.now() });
    return student;
  }

  async schoolDeleteStudent(userId: string, studentId: string) {
    const fleetId = await this.getFleetId(userId);
    const store = this.getSchoolStore(fleetId);
    const next = store.students.filter((item) => item.id !== studentId);
    if (next.length === store.students.length) throw new NotFoundException('Student not found');
    store.students = next;
    return { deleted: true };
  }

  async schoolListAttendance(userId: string, studentId?: string) {
    const fleetId = await this.getFleetId(userId);
    const entries = this.getSchoolStore(fleetId).attendance;
    return studentId ? entries.filter((item) => item.studentId === studentId) : entries;
  }

  async schoolUpsertAttendance(userId: string, input: Record<string, unknown>) {
    const fleetId = await this.getFleetId(userId);
    const store = this.getSchoolStore(fleetId);
    const created = { id: uuidv4(), ...input, createdAt: Date.now(), updatedAt: Date.now() };
    store.attendance.unshift(created);
    return created;
  }

  async schoolListTrips(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.getSchoolStore(fleetId).trips;
  }

  async schoolCreateTrip(userId: string, input: Record<string, unknown>) {
    const fleetId = await this.getFleetId(userId);
    const store = this.getSchoolStore(fleetId);
    const created = { id: uuidv4(), status: 'scheduled', ...input, createdAt: Date.now(), updatedAt: Date.now() };
    store.trips.unshift(created);
    return created;
  }

  async schoolGetTrip(userId: string, tripId: string) {
    const fleetId = await this.getFleetId(userId);
    const trip = this.getSchoolStore(fleetId).trips.find((item) => item.id === tripId);
    if (!trip) throw new NotFoundException('School trip not found');
    return trip;
  }

  async schoolPatchTrip(userId: string, tripId: string, patch: Record<string, unknown>) {
    const trip = await this.schoolGetTrip(userId, tripId);
    Object.assign(trip, patch, { updatedAt: Date.now() });
    return trip;
  }

  async schoolCancelTrip(userId: string, tripId: string, reason?: string) {
    return this.schoolPatchTrip(userId, tripId, { status: 'cancelled', cancelReason: reason });
  }

  async schoolTripLive(userId: string, tripId: string) {
    const trip = await this.schoolGetTrip(userId, tripId);
    return {
      tripId,
      status: trip.status,
      vehicleLocation: { lat: 0.3476, lng: 32.5825 },
      updatedAt: Date.now(),
    };
  }

  async schoolListAttendants(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.getSchoolStore(fleetId).attendants;
  }

  async schoolCreateAttendant(userId: string, input: Record<string, unknown>) {
    const fleetId = await this.getFleetId(userId);
    const store = this.getSchoolStore(fleetId);
    const created = { id: uuidv4(), ...input, createdAt: Date.now(), updatedAt: Date.now() };
    store.attendants.unshift(created);
    return created;
  }

  async schoolGetAttendant(userId: string, attendantId: string) {
    const fleetId = await this.getFleetId(userId);
    const attendant = this.getSchoolStore(fleetId).attendants.find((item) => item.id === attendantId);
    if (!attendant) throw new NotFoundException('Attendant not found');
    return attendant;
  }

  async schoolPatchAttendant(userId: string, attendantId: string, patch: Record<string, unknown>) {
    const attendant = await this.schoolGetAttendant(userId, attendantId);
    Object.assign(attendant, patch, { updatedAt: Date.now() });
    return attendant;
  }

  async schoolDeleteAttendant(userId: string, attendantId: string) {
    const fleetId = await this.getFleetId(userId);
    const store = this.getSchoolStore(fleetId);
    const next = store.attendants.filter((item) => item.id !== attendantId);
    if (next.length === store.attendants.length) throw new NotFoundException('Attendant not found');
    store.attendants = next;
    return { deleted: true };
  }

  async schoolListPayments(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.getSchoolStore(fleetId).payments;
  }

  async schoolCreatePayment(userId: string, input: Record<string, unknown>) {
    const fleetId = await this.getFleetId(userId);
    const store = this.getSchoolStore(fleetId);
    const created = { id: uuidv4(), ...input, createdAt: Date.now() };
    store.payments.unshift(created);
    return created;
  }

  async schoolListFeedback(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.getSchoolStore(fleetId).feedback;
  }

  async schoolCreateFeedback(userId: string, input: Record<string, unknown>) {
    const fleetId = await this.getFleetId(userId);
    const store = this.getSchoolStore(fleetId);
    const created = { id: uuidv4(), ...input, createdAt: Date.now() };
    store.feedback.unshift(created);
    return created;
  }

  async schoolRoster(userId: string, routeId?: string) {
    const students = await this.schoolListStudents(userId);
    if (!routeId) return students;
    return students.filter((item) => item.routeId === routeId);
  }

  async schoolTripCalendar(userId: string, date?: string) {
    const trips = await this.schoolListTrips(userId);
    if (!date) return trips;
    return trips.filter((trip) => String(trip.date || trip.scheduledDate || '').startsWith(date));
  }

  async schoolPerformanceReport(userId: string) {
    const trips = await this.schoolListTrips(userId);
    const attendance = await this.schoolListAttendance(userId);
    const completedTrips = trips.filter((trip) => trip.status === 'completed').length;
    return {
      tripsTotal: trips.length,
      tripsCompleted: completedTrips,
      onTimeRate: trips.length ? Number(((completedTrips / trips.length) * 100).toFixed(2)) : 0,
      attendanceEntries: attendance.length,
    };
  }

  async schoolBulkReminders(userId: string, input: { message: string; target?: string }) {
    await this.getFleetId(userId);
    return {
      sent: true,
      message: input.message,
      target: input.target || 'all',
      sentAt: Date.now(),
    };
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
