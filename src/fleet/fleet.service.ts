import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
    private readonly prisma: PrismaService,
    private readonly fleetRealtimeGateway: FleetRealtimeGateway,
  ) {}

  async getProfile(userId: string) {
    const fleetId = await this.getFleetId(userId);
    const profile = await this.prisma.fleetPartnerProfile.findFirst({ where: { fleetId } });
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
    return this.prisma.fleetPartnerProfile.update({
      where: { id: profile.id },
      data: patch,
    });
  }

  async listBranches(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.prisma.fleetBranch.findMany({ where: { fleetId } });
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
    return this.prisma.fleetBranch.create({
      data: { fleetId, ...input } as any,
    });
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
    const branch = await this.prisma.fleetBranch.findFirst({ where: { id: branchId, fleetId } });
    if (!branch) {
      throw new NotFoundException('Fleet branch not found');
    }
    return this.prisma.fleetBranch.update({ where: { id: branchId }, data: patch as any });
  }

  async deleteBranch(userId: string, branchId: string) {
    const fleetId = await this.getFleetId(userId);
    try {
      await this.prisma.fleetBranch.delete({ where: { id: branchId } });
    } catch {
      throw new NotFoundException('Fleet branch not found');
    }
    return { deleted: true };
  }

  async listDrivers(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.prisma.fleetDriver.findMany({ where: { fleetId } });
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

    await this.prisma.user.create({
      data: {
        id: userRecordId,
        email: input.email,
        password: 'password123',
        phone: input.phone,
        roles: ['driver'],
        status: 'active',
        driverId,
      },
    });

    await this.prisma.driverProfile.create({
      data: {
        userId: userRecordId,
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
      },
    });

    return this.prisma.fleetDriver.create({
      data: {
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
      },
    });
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

    const fleetDriver = await this.prisma.fleetDriver.findFirst({ where: { driverId, fleetId } });
    if (!fleetDriver) {
      throw new NotFoundException('Fleet driver not found');
    }

    await this.prisma.fleetDriver.update({ where: { id: fleetDriver.id }, data: patch });

    const profile = await this.prisma.driverProfile.findFirst({ where: { userId: fleetDriver.userId } });
    if (profile) {
      const prefData: Record<string, unknown> = {};
      if (patch.serviceModes) prefData.serviceIds = patch.serviceModes;
      await this.prisma.driverProfile.update({
        where: { id: profile.id },
        data: {
          branchId: patch.branchId ?? profile.branchId,
          fullName: patch.fullName ?? profile.fullName,
          email: patch.email ?? profile.email,
          phone: patch.phone ?? profile.phone,
          city: patch.city ?? profile.city,
          country: patch.country ?? profile.country,
          ...(Object.keys(prefData).length ? { preferences: { ...(profile.preferences as any), ...prefData } } : {}),
        },
      });
    }

    const user = await this.prisma.user.findFirst({ where: { id: fleetDriver.userId } });
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          email: patch.email ?? user.email,
          phone: patch.phone ?? user.phone,
        },
      });
    }

    return this.prisma.fleetDriver.findFirst({ where: { id: fleetDriver.id } });
  }

  async listDispatches(userId: string, type?: string) {
    const fleetId = await this.getFleetId(userId);
    const where: any = { fleetId };
    if (type) where.type = type;
    return this.prisma.fleetDispatch.findMany({ where });
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

    const savedDispatch = await this.prisma.fleetDispatch.create({
      data: {
        fleetId,
        type,
        status: input.driverId ? 'assigned' : 'pending',
        driverId: input.driverId,
        vehicleId: input.vehicleId,
        tripId,
        pickup: input.pickup,
        dropoff: input.dropoff,
        notes: input.notes,
      },
    });

    const trip = await this.prisma.trip.create({
      data: {
        id: tripId,
        riderId: `fleet:${fleetId}`,
        driverId: input.driverId,
        fleetId,
        type: type as any,
        status: 'requested' as any,
        pickup: input.pickup,
        dropoff: input.dropoff,
        pickupAddress: input.pickup,
        dropoffAddress: input.dropoff,
        pickupLocation: { lat: 0, lng: 0 } as any,
        dropoffLocation: { lat: 0, lng: 0 } as any,
        otpCode: String(Math.floor(1000 + Math.random() * 9000)),
      } as any,
    });

    if (input.driverId) {
      await this.prisma.jobOffer.create({
        data: {
          driverId: input.driverId,
          riderId: trip.riderId,
          tripId,
          type: type as any,
          status: 'offered',
          pickup: input.pickup,
          dropoff: input.dropoff,
          pickupLocation: { lat: 0, lng: 0 } as any,
          dropoffLocation: { lat: 0, lng: 0 } as any,
        },
      });
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
    const drivers = await this.prisma.fleetDriver.findMany({ where: { fleetId } });
    const driverIds = drivers.map((d) => d.driverId).filter(Boolean) as string[];

    return this.prisma.trip.findMany({
      where: {
        OR: [{ fleetId }, { driverId: { in: driverIds } }],
      },
    });
  }

  async listServices(userId: string, service: string) {
    const fleetId = await this.getFleetId(userId);
    return this.prisma.fleetServiceRecord.findMany({ where: { fleetId, service: service as any } });
  }

  async createService(
    userId: string,
    service: string,
    input: { customerName: string; assetId?: string; scheduledAt: number; notes?: string },
  ) {
    const fleetId = await this.getFleetId(userId);
    await this.ensureFleetVehicle(fleetId, input.assetId);

    return this.prisma.fleetServiceRecord.create({
      data: {
        fleetId,
        service: service as any,
        status: 'pending' as any,
        customerName: input.customerName,
        assetId: input.assetId,
        scheduledAt: input.scheduledAt,
        notes: input.notes,
      } as any,
    });
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
    return this.prisma.fleetPayout.findMany({ where: { fleetId } });
  }

  async listComplianceIncidents(userId: string) {
    const fleetId = await this.getFleetId(userId);
    return this.prisma.fleetComplianceIncident.findMany({ where: { fleetId } });
  }

  async createComplianceIncident(
    userId: string,
    input: { category: string; severity: string; description: string },
  ) {
    const fleetId = await this.getFleetId(userId);
    const saved = await this.prisma.fleetComplianceIncident.create({
      data: {
        fleetId,
        category: input.category,
        severity: input.severity as any,
        status: 'open' as any,
        description: input.description,
      },
    });
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
    return this.prisma.fleetTrainingCourse.findMany({ where: { fleetId } });
  }

  async createTrainingCourse(userId: string, input: { title: string; assignedTo?: string }) {
    const fleetId = await this.getFleetId(userId);
    await this.ensureFleetDriver(fleetId, input.assignedTo);

    const saved = await this.prisma.fleetTrainingCourse.create({
      data: {
        fleetId,
        title: input.title,
        status: 'draft',
        assignedTo: input.assignedTo,
      },
    });
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

    const records = await this.prisma.riderServiceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
    const branch = await this.prisma.fleetBranch.findFirst({ where: { id: branchId, fleetId } });
    if (!branch) {
      throw new NotFoundException('Fleet branch not found');
    }
    return branch;
  }

  async getDriverById(userId: string, driverId: string) {
    const fleetId = await this.getFleetId(userId);
    const driver = await this.prisma.fleetDriver.findFirst({ where: { fleetId, driverId } });
    if (!driver) {
      throw new NotFoundException('Fleet driver not found');
    }
    return driver;
  }

  async deleteDriver(userId: string, driverId: string) {
    const fleetId = await this.getFleetId(userId);
    const driver = await this.prisma.fleetDriver.findFirst({ where: { fleetId, driverId } });
    if (!driver) {
      throw new NotFoundException('Fleet driver not found');
    }
    await this.prisma.fleetDriver.delete({ where: { id: driver.id } });
    return { deleted: true };
  }

  async removeVehicle(userId: string, vehicleId: string) {
    const fleetId = await this.getFleetId(userId);
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Fleet vehicle not found');
    }
    await this.prisma.vehicle.delete({ where: { id: vehicleId } });
    return { deleted: true };
  }

  async listVehicleDocuments(userId: string, vehicleId: string) {
    const fleetId = await this.getFleetId(userId);
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Fleet vehicle not found');
    }
    const documents = (vehicle.documents as Record<string, unknown>) || {};
    return Object.entries(documents).map(([documentType, payload]) => ({ documentType, ...(payload as object) }));
  }

  async createVehicleDocument(userId: string, vehicleId: string, input: { documentType: string; fileUrl: string; expiryDate?: string }) {
    const fleetId = await this.getFleetId(userId);
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Fleet vehicle not found');
    }
    const documents = (vehicle.documents as Record<string, unknown>) || {};
    documents[input.documentType] = {
      fileUrl: input.fileUrl,
      expiryDate: input.expiryDate || null,
      status: 'under_review',
      updatedAt: Date.now(),
    };
    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { documents: documents as any },
    });
    return { documentType: input.documentType, ...(documents as any)[input.documentType] };
  }

  async listVehicleMaintenanceHistory(userId: string, vehicleId: string) {
    const fleetId = await this.getFleetId(userId);
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Fleet vehicle not found');
    }
    const accessories = (vehicle.accessories as Record<string, unknown>) || {};
    const history = Array.isArray(accessories.maintenanceHistory) ? accessories.maintenanceHistory : [];
    return history;
  }

  async createVehicleMaintenanceRecord(
    userId: string,
    vehicleId: string,
    input: { title: string; notes?: string; cost?: number; servicedAt?: number },
  ) {
    const fleetId = await this.getFleetId(userId);
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Fleet vehicle not found');
    }
    const accessories = (vehicle.accessories as Record<string, any>) || {};
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
    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { accessories: accessories as any },
    });
    return record;
  }

  async getDispatchById(userId: string, dispatchId: string) {
    const fleetId = await this.getFleetId(userId);
    const dispatch = await this.prisma.fleetDispatch.findFirst({ where: { id: dispatchId, fleetId } });
    if (!dispatch) {
      throw new NotFoundException('Fleet dispatch not found');
    }
    return dispatch;
  }

  async patchDispatch(userId: string, dispatchId: string, patch: Partial<{ pickup: string; dropoff: string; notes: string; status: string; driverId: string; vehicleId: string }>) {
    const fleetId = await this.getFleetId(userId);
    const dispatch = await this.prisma.fleetDispatch.findFirst({ where: { id: dispatchId, fleetId } });
    if (!dispatch) {
      throw new NotFoundException('Fleet dispatch not found');
    }
    await this.ensureFleetDriver(fleetId, patch.driverId);
    await this.ensureFleetVehicle(fleetId, patch.vehicleId);
    return this.prisma.fleetDispatch.update({ where: { id: dispatchId }, data: patch as any });
  }

  async deleteDispatch(userId: string, dispatchId: string) {
    const fleetId = await this.getFleetId(userId);
    const dispatch = await this.prisma.fleetDispatch.findFirst({ where: { id: dispatchId, fleetId } });
    if (!dispatch) {
      throw new NotFoundException('Fleet dispatch not found');
    }
    await this.prisma.fleetDispatch.delete({ where: { id: dispatchId } });
    return { deleted: true };
  }

  async assignDispatch(userId: string, dispatchId: string, input: { driverId?: string; vehicleId?: string }) {
    return this.patchDispatch(userId, dispatchId, {
      driverId: input.driverId,
      vehicleId: input.vehicleId,
      status: input.driverId ? 'assigned' : 'pending',
    });
  }

  async getServiceById(userId: string, service: string, serviceId: string) {
    const fleetId = await this.getFleetId(userId);
    const record = await this.prisma.fleetServiceRecord.findFirst({ where: { id: serviceId, fleetId, service: service as any } });
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
    const record = await this.prisma.fleetServiceRecord.findFirst({ where: { id: serviceId, fleetId, service: service as any } });
    if (!record) {
      throw new NotFoundException('Fleet service record not found');
    }
    await this.ensureFleetVehicle(fleetId, patch.assetId);
    return this.prisma.fleetServiceRecord.update({ where: { id: serviceId }, data: patch as any });
  }

  async cancelServiceById(userId: string, service: string, serviceId: string, reason?: string) {
    return this.patchServiceById(userId, service, serviceId, { status: 'cancelled', notes: reason });
  }

  async getComplianceIncidentById(userId: string, incidentId: string) {
    const fleetId = await this.getFleetId(userId);
    const incident = await this.prisma.fleetComplianceIncident.findFirst({ where: { id: incidentId, fleetId } });
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
    const incident = await this.prisma.fleetComplianceIncident.findFirst({ where: { id: incidentId, fleetId } });
    if (!incident) {
      throw new NotFoundException('Compliance incident not found');
    }
    return this.prisma.fleetComplianceIncident.update({ where: { id: incidentId }, data: patch as any });
  }

  async getTrainingCourseById(userId: string, courseId: string) {
    const fleetId = await this.getFleetId(userId);
    const course = await this.prisma.fleetTrainingCourse.findFirst({ where: { id: courseId, fleetId } });
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
    const course = await this.prisma.fleetTrainingCourse.findFirst({ where: { id: courseId, fleetId } });
    if (!course) {
      throw new NotFoundException('Training course not found');
    }
    return this.prisma.fleetTrainingCourse.update({ where: { id: courseId }, data: patch as any });
  }

  async deleteTrainingCourseById(userId: string, courseId: string) {
    const fleetId = await this.getFleetId(userId);
    const course = await this.prisma.fleetTrainingCourse.findFirst({ where: { id: courseId, fleetId } });
    if (!course) {
      throw new NotFoundException('Training course not found');
    }
    await this.prisma.fleetTrainingCourse.delete({ where: { id: courseId } });
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
    const payout = await this.prisma.fleetPayout.findFirst({ where: { id: payoutId, fleetId } });
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
    return studentId ? entries.filter((item: any) => item.studentId === studentId) : entries;
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
    return students.filter((item: any) => item.routeId === routeId);
  }

  async schoolTripCalendar(userId: string, date?: string) {
    const trips = await this.schoolListTrips(userId);
    if (!date) return trips;
    return trips.filter((trip) => String((trip as any).date || (trip as any).scheduledDate || '').startsWith(date));
  }

  async schoolPerformanceReport(userId: string) {
    const trips = await this.schoolListTrips(userId);
    const attendance = await this.schoolListAttendance(userId);
    const completedTrips = trips.filter((trip) => (trip as any).status === 'completed').length;
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
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    return user?.fleetId ?? userId;
  }

  private async ensureBranchBelongsToFleet(fleetId: string, branchId?: string) {
    if (!branchId) return;
    const branch = await this.prisma.fleetBranch.findFirst({ where: { id: branchId, fleetId } });
    if (!branch) {
      throw new BadRequestException('Branch does not belong to this fleet');
    }
  }

  private async ensureFleetDriver(fleetId: string, driverId?: string) {
    if (!driverId) return;
    const driver = await this.prisma.fleetDriver.findFirst({ where: { fleetId, driverId } });
    if (!driver) {
      throw new BadRequestException('Driver does not belong to this fleet');
    }
  }

  private async ensureFleetVehicle(fleetId: string, vehicleId?: string) {
    if (!vehicleId) return;
    const vehicle = await this.prisma.vehicle.findFirst({ where: { fleetId, id: vehicleId } });
    if (!vehicle) {
      throw new BadRequestException('Vehicle does not belong to this fleet');
    }
  }

  private async getFleetEarningsEvents(fleetId: string, period?: 'day' | 'week' | 'month' | 'quarter' | 'year') {
    const drivers = await this.prisma.fleetDriver.findMany({ where: { fleetId } });
    const driverIds = drivers.map((d) => d.driverId).filter(Boolean) as string[];

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

    const where: any = { userId: { in: driverIds } };
    if (threshold) {
      where.createdAt = { gte: threshold };
    }

    return this.prisma.earningsLedger.findMany({ where });
  }
}
