"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const scoped_realtime_gateway_1 = require("../realtime/scoped-realtime.gateway");
const uuid_1 = require("uuid");
let FleetService = class FleetService {
    constructor(prisma, fleetRealtimeGateway) {
        this.prisma = prisma;
        this.fleetRealtimeGateway = fleetRealtimeGateway;
        this.schoolOpsStore = new Map();
    }
    async getProfile(userId) {
        const fleetId = await this.getFleetId(userId);
        const profile = await this.prisma.fleetPartnerProfile.findFirst({ where: { fleetId } });
        if (!profile) {
            throw new common_1.NotFoundException('Fleet profile not found');
        }
        return profile;
    }
    async updateProfile(userId, patch) {
        const profile = await this.getProfile(userId);
        return this.prisma.fleetPartnerProfile.update({
            where: { id: profile.id },
            data: patch,
        });
    }
    async listBranches(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.prisma.fleetBranch.findMany({ where: { fleetId } });
    }
    async createBranch(userId, input) {
        const fleetId = await this.getFleetId(userId);
        return this.prisma.fleetBranch.create({
            data: { fleetId, ...input },
        });
    }
    async patchBranch(userId, branchId, patch) {
        const fleetId = await this.getFleetId(userId);
        const branch = await this.prisma.fleetBranch.findFirst({ where: { id: branchId, fleetId } });
        if (!branch) {
            throw new common_1.NotFoundException('Fleet branch not found');
        }
        return this.prisma.fleetBranch.update({ where: { id: branchId }, data: patch });
    }
    async deleteBranch(userId, branchId) {
        const fleetId = await this.getFleetId(userId);
        try {
            await this.prisma.fleetBranch.delete({ where: { id: branchId } });
        }
        catch {
            throw new common_1.NotFoundException('Fleet branch not found');
        }
        return { deleted: true };
    }
    async listDrivers(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.prisma.fleetDriver.findMany({ where: { fleetId } });
    }
    async createDriver(userId, input) {
        const fleetId = await this.getFleetId(userId);
        await this.ensureBranchBelongsToFleet(fleetId, input.branchId);
        const driverId = (0, uuid_1.v4)();
        const userRecordId = (0, uuid_1.v4)();
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
    async patchDriver(userId, driverId, patch) {
        const fleetId = await this.getFleetId(userId);
        await this.ensureBranchBelongsToFleet(fleetId, patch.branchId);
        const fleetDriver = await this.prisma.fleetDriver.findFirst({ where: { driverId, fleetId } });
        if (!fleetDriver) {
            throw new common_1.NotFoundException('Fleet driver not found');
        }
        await this.prisma.fleetDriver.update({ where: { id: fleetDriver.id }, data: patch });
        const profile = await this.prisma.driverProfile.findFirst({ where: { userId: fleetDriver.userId } });
        if (profile) {
            const prefData = {};
            if (patch.serviceModes)
                prefData.serviceIds = patch.serviceModes;
            await this.prisma.driverProfile.update({
                where: { id: profile.id },
                data: {
                    branchId: patch.branchId ?? profile.branchId,
                    fullName: patch.fullName ?? profile.fullName,
                    email: patch.email ?? profile.email,
                    phone: patch.phone ?? profile.phone,
                    city: patch.city ?? profile.city,
                    country: patch.country ?? profile.country,
                    ...(Object.keys(prefData).length ? { preferences: { ...profile.preferences, ...prefData } } : {}),
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
    async listDispatches(userId, type) {
        const fleetId = await this.getFleetId(userId);
        const where = { fleetId };
        if (type)
            where.type = type;
        return this.prisma.fleetDispatch.findMany({ where });
    }
    async createDispatch(userId, input, forcedType) {
        const fleetId = await this.getFleetId(userId);
        const type = forcedType ?? input.type ?? 'ride';
        await this.ensureFleetDriver(fleetId, input.driverId);
        await this.ensureFleetVehicle(fleetId, input.vehicleId);
        const tripId = (0, uuid_1.v4)();
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
                type: type,
                status: 'requested',
                pickup: input.pickup,
                dropoff: input.dropoff,
                pickupAddress: input.pickup,
                dropoffAddress: input.dropoff,
                pickupLocation: { lat: 0, lng: 0 },
                dropoffLocation: { lat: 0, lng: 0 },
                otpCode: String(Math.floor(1000 + Math.random() * 9000)),
            },
        });
        if (input.driverId) {
            await this.prisma.jobOffer.create({
                data: {
                    driverId: input.driverId,
                    riderId: trip.riderId,
                    tripId,
                    type: type,
                    status: 'offered',
                    pickup: input.pickup,
                    dropoff: input.dropoff,
                    pickupLocation: { lat: 0, lng: 0 },
                    dropoffLocation: { lat: 0, lng: 0 },
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
    async listTrips(userId) {
        const fleetId = await this.getFleetId(userId);
        const drivers = await this.prisma.fleetDriver.findMany({ where: { fleetId } });
        const driverIds = drivers.map((d) => d.driverId).filter(Boolean);
        return this.prisma.trip.findMany({
            where: {
                OR: [{ fleetId }, { driverId: { in: driverIds } }],
            },
        });
    }
    async listServices(userId, service) {
        const fleetId = await this.getFleetId(userId);
        return this.prisma.fleetServiceRecord.findMany({ where: { fleetId, service: service } });
    }
    async createService(userId, service, input) {
        const fleetId = await this.getFleetId(userId);
        await this.ensureFleetVehicle(fleetId, input.assetId);
        return this.prisma.fleetServiceRecord.create({
            data: {
                fleetId,
                service: service,
                status: 'pending',
                customerName: input.customerName,
                assetId: input.assetId,
                scheduledAt: input.scheduledAt,
                notes: input.notes,
            },
        });
    }
    async getEarningsSummary(userId, period = 'week') {
        const fleetId = await this.getFleetId(userId);
        const events = await this.getFleetEarningsEvents(fleetId, period);
        return {
            period,
            total: events.reduce((sum, item) => sum + Number(item.amount), 0),
            currency: 'UGX',
            count: events.length,
        };
    }
    async getStatements(userId) {
        const fleetId = await this.getFleetId(userId);
        const events = await this.getFleetEarningsEvents(fleetId);
        const grouped = new Map();
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
    async getPayouts(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.prisma.fleetPayout.findMany({ where: { fleetId } });
    }
    async listComplianceIncidents(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.prisma.fleetComplianceIncident.findMany({ where: { fleetId } });
    }
    async createComplianceIncident(userId, input) {
        const fleetId = await this.getFleetId(userId);
        const saved = await this.prisma.fleetComplianceIncident.create({
            data: {
                fleetId,
                category: input.category,
                severity: input.severity,
                status: 'open',
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
    async listTrainingCourses(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.prisma.fleetTrainingCourse.findMany({ where: { fleetId } });
    }
    async createTrainingCourse(userId, input) {
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
    async listRiderServiceRequests(userId, query = {}) {
        await this.getFleetId(userId);
        const where = {};
        if (query.serviceType)
            where.serviceType = query.serviceType;
        if (query.status)
            where.status = query.status;
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
    async getBranchById(userId, branchId) {
        const fleetId = await this.getFleetId(userId);
        const branch = await this.prisma.fleetBranch.findFirst({ where: { id: branchId, fleetId } });
        if (!branch) {
            throw new common_1.NotFoundException('Fleet branch not found');
        }
        return branch;
    }
    async getDriverById(userId, driverId) {
        const fleetId = await this.getFleetId(userId);
        const driver = await this.prisma.fleetDriver.findFirst({ where: { fleetId, driverId } });
        if (!driver) {
            throw new common_1.NotFoundException('Fleet driver not found');
        }
        return driver;
    }
    async deleteDriver(userId, driverId) {
        const fleetId = await this.getFleetId(userId);
        const driver = await this.prisma.fleetDriver.findFirst({ where: { fleetId, driverId } });
        if (!driver) {
            throw new common_1.NotFoundException('Fleet driver not found');
        }
        await this.prisma.fleetDriver.delete({ where: { id: driver.id } });
        return { deleted: true };
    }
    async removeVehicle(userId, vehicleId) {
        const fleetId = await this.getFleetId(userId);
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Fleet vehicle not found');
        }
        await this.prisma.vehicle.delete({ where: { id: vehicleId } });
        return { deleted: true };
    }
    async listVehicleDocuments(userId, vehicleId) {
        const fleetId = await this.getFleetId(userId);
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Fleet vehicle not found');
        }
        const documents = vehicle.documents || {};
        return Object.entries(documents).map(([documentType, payload]) => ({ documentType, ...payload }));
    }
    async createVehicleDocument(userId, vehicleId, input) {
        const fleetId = await this.getFleetId(userId);
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Fleet vehicle not found');
        }
        const documents = vehicle.documents || {};
        documents[input.documentType] = {
            fileUrl: input.fileUrl,
            expiryDate: input.expiryDate || null,
            status: 'under_review',
            updatedAt: Date.now(),
        };
        await this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: { documents: documents },
        });
        return { documentType: input.documentType, ...documents[input.documentType] };
    }
    async listVehicleMaintenanceHistory(userId, vehicleId) {
        const fleetId = await this.getFleetId(userId);
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Fleet vehicle not found');
        }
        const accessories = vehicle.accessories || {};
        const history = Array.isArray(accessories.maintenanceHistory) ? accessories.maintenanceHistory : [];
        return history;
    }
    async createVehicleMaintenanceRecord(userId, vehicleId, input) {
        const fleetId = await this.getFleetId(userId);
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Fleet vehicle not found');
        }
        const accessories = vehicle.accessories || {};
        const history = Array.isArray(accessories.maintenanceHistory) ? accessories.maintenanceHistory : [];
        const record = {
            id: (0, uuid_1.v4)(),
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
            data: { accessories: accessories },
        });
        return record;
    }
    async getDispatchById(userId, dispatchId) {
        const fleetId = await this.getFleetId(userId);
        const dispatch = await this.prisma.fleetDispatch.findFirst({ where: { id: dispatchId, fleetId } });
        if (!dispatch) {
            throw new common_1.NotFoundException('Fleet dispatch not found');
        }
        return dispatch;
    }
    async patchDispatch(userId, dispatchId, patch) {
        const fleetId = await this.getFleetId(userId);
        const dispatch = await this.prisma.fleetDispatch.findFirst({ where: { id: dispatchId, fleetId } });
        if (!dispatch) {
            throw new common_1.NotFoundException('Fleet dispatch not found');
        }
        await this.ensureFleetDriver(fleetId, patch.driverId);
        await this.ensureFleetVehicle(fleetId, patch.vehicleId);
        return this.prisma.fleetDispatch.update({ where: { id: dispatchId }, data: patch });
    }
    async deleteDispatch(userId, dispatchId) {
        const fleetId = await this.getFleetId(userId);
        const dispatch = await this.prisma.fleetDispatch.findFirst({ where: { id: dispatchId, fleetId } });
        if (!dispatch) {
            throw new common_1.NotFoundException('Fleet dispatch not found');
        }
        await this.prisma.fleetDispatch.delete({ where: { id: dispatchId } });
        return { deleted: true };
    }
    async assignDispatch(userId, dispatchId, input) {
        return this.patchDispatch(userId, dispatchId, {
            driverId: input.driverId,
            vehicleId: input.vehicleId,
            status: input.driverId ? 'assigned' : 'pending',
        });
    }
    async getServiceById(userId, service, serviceId) {
        const fleetId = await this.getFleetId(userId);
        const record = await this.prisma.fleetServiceRecord.findFirst({ where: { id: serviceId, fleetId, service: service } });
        if (!record) {
            throw new common_1.NotFoundException('Fleet service record not found');
        }
        return record;
    }
    async patchServiceById(userId, service, serviceId, patch) {
        const fleetId = await this.getFleetId(userId);
        const record = await this.prisma.fleetServiceRecord.findFirst({ where: { id: serviceId, fleetId, service: service } });
        if (!record) {
            throw new common_1.NotFoundException('Fleet service record not found');
        }
        await this.ensureFleetVehicle(fleetId, patch.assetId);
        return this.prisma.fleetServiceRecord.update({ where: { id: serviceId }, data: patch });
    }
    async cancelServiceById(userId, service, serviceId, reason) {
        return this.patchServiceById(userId, service, serviceId, { status: 'cancelled', notes: reason });
    }
    async getComplianceIncidentById(userId, incidentId) {
        const fleetId = await this.getFleetId(userId);
        const incident = await this.prisma.fleetComplianceIncident.findFirst({ where: { id: incidentId, fleetId } });
        if (!incident) {
            throw new common_1.NotFoundException('Compliance incident not found');
        }
        return incident;
    }
    async patchComplianceIncidentById(userId, incidentId, patch) {
        const fleetId = await this.getFleetId(userId);
        const incident = await this.prisma.fleetComplianceIncident.findFirst({ where: { id: incidentId, fleetId } });
        if (!incident) {
            throw new common_1.NotFoundException('Compliance incident not found');
        }
        return this.prisma.fleetComplianceIncident.update({ where: { id: incidentId }, data: patch });
    }
    async getTrainingCourseById(userId, courseId) {
        const fleetId = await this.getFleetId(userId);
        const course = await this.prisma.fleetTrainingCourse.findFirst({ where: { id: courseId, fleetId } });
        if (!course) {
            throw new common_1.NotFoundException('Training course not found');
        }
        return course;
    }
    async patchTrainingCourseById(userId, courseId, patch) {
        const fleetId = await this.getFleetId(userId);
        await this.ensureFleetDriver(fleetId, patch.assignedTo);
        const course = await this.prisma.fleetTrainingCourse.findFirst({ where: { id: courseId, fleetId } });
        if (!course) {
            throw new common_1.NotFoundException('Training course not found');
        }
        return this.prisma.fleetTrainingCourse.update({ where: { id: courseId }, data: patch });
    }
    async deleteTrainingCourseById(userId, courseId) {
        const fleetId = await this.getFleetId(userId);
        const course = await this.prisma.fleetTrainingCourse.findFirst({ where: { id: courseId, fleetId } });
        if (!course) {
            throw new common_1.NotFoundException('Training course not found');
        }
        await this.prisma.fleetTrainingCourse.delete({ where: { id: courseId } });
        return { deleted: true };
    }
    async getStatementById(userId, statementId) {
        const statements = await this.getStatements(userId);
        const statement = statements.find((item) => item.statementMonth === statementId);
        if (!statement) {
            throw new common_1.NotFoundException('Statement not found');
        }
        return statement;
    }
    async getPayoutById(userId, payoutId) {
        const fleetId = await this.getFleetId(userId);
        const payout = await this.prisma.fleetPayout.findFirst({ where: { id: payoutId, fleetId } });
        if (!payout) {
            throw new common_1.NotFoundException('Payout not found');
        }
        return payout;
    }
    getSchoolStore(fleetId) {
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
        return this.schoolOpsStore.get(fleetId);
    }
    async schoolListRoutes(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.getSchoolStore(fleetId).routes;
    }
    async schoolCreateRoute(userId, input) {
        const fleetId = await this.getFleetId(userId);
        const store = this.getSchoolStore(fleetId);
        const created = { id: (0, uuid_1.v4)(), ...input, createdAt: Date.now(), updatedAt: Date.now() };
        store.routes.unshift(created);
        return created;
    }
    async schoolGetRoute(userId, routeId) {
        const fleetId = await this.getFleetId(userId);
        const route = this.getSchoolStore(fleetId).routes.find((item) => item.id === routeId);
        if (!route)
            throw new common_1.NotFoundException('Route not found');
        return route;
    }
    async schoolPatchRoute(userId, routeId, patch) {
        const route = await this.schoolGetRoute(userId, routeId);
        Object.assign(route, patch, { updatedAt: Date.now() });
        return route;
    }
    async schoolDeleteRoute(userId, routeId) {
        const fleetId = await this.getFleetId(userId);
        const store = this.getSchoolStore(fleetId);
        const next = store.routes.filter((item) => item.id !== routeId);
        if (next.length === store.routes.length)
            throw new common_1.NotFoundException('Route not found');
        store.routes = next;
        return { deleted: true };
    }
    async schoolListStudents(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.getSchoolStore(fleetId).students;
    }
    async schoolCreateStudent(userId, input) {
        const fleetId = await this.getFleetId(userId);
        const store = this.getSchoolStore(fleetId);
        const created = { id: (0, uuid_1.v4)(), ...input, createdAt: Date.now(), updatedAt: Date.now() };
        store.students.unshift(created);
        return created;
    }
    async schoolGetStudent(userId, studentId) {
        const fleetId = await this.getFleetId(userId);
        const student = this.getSchoolStore(fleetId).students.find((item) => item.id === studentId);
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return student;
    }
    async schoolPatchStudent(userId, studentId, patch) {
        const student = await this.schoolGetStudent(userId, studentId);
        Object.assign(student, patch, { updatedAt: Date.now() });
        return student;
    }
    async schoolDeleteStudent(userId, studentId) {
        const fleetId = await this.getFleetId(userId);
        const store = this.getSchoolStore(fleetId);
        const next = store.students.filter((item) => item.id !== studentId);
        if (next.length === store.students.length)
            throw new common_1.NotFoundException('Student not found');
        store.students = next;
        return { deleted: true };
    }
    async schoolListAttendance(userId, studentId) {
        const fleetId = await this.getFleetId(userId);
        const entries = this.getSchoolStore(fleetId).attendance;
        return studentId ? entries.filter((item) => item.studentId === studentId) : entries;
    }
    async schoolUpsertAttendance(userId, input) {
        const fleetId = await this.getFleetId(userId);
        const store = this.getSchoolStore(fleetId);
        const created = { id: (0, uuid_1.v4)(), ...input, createdAt: Date.now(), updatedAt: Date.now() };
        store.attendance.unshift(created);
        return created;
    }
    async schoolListTrips(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.getSchoolStore(fleetId).trips;
    }
    async schoolCreateTrip(userId, input) {
        const fleetId = await this.getFleetId(userId);
        const store = this.getSchoolStore(fleetId);
        const created = { id: (0, uuid_1.v4)(), status: 'scheduled', ...input, createdAt: Date.now(), updatedAt: Date.now() };
        store.trips.unshift(created);
        return created;
    }
    async schoolGetTrip(userId, tripId) {
        const fleetId = await this.getFleetId(userId);
        const trip = this.getSchoolStore(fleetId).trips.find((item) => item.id === tripId);
        if (!trip)
            throw new common_1.NotFoundException('School trip not found');
        return trip;
    }
    async schoolPatchTrip(userId, tripId, patch) {
        const trip = await this.schoolGetTrip(userId, tripId);
        Object.assign(trip, patch, { updatedAt: Date.now() });
        return trip;
    }
    async schoolCancelTrip(userId, tripId, reason) {
        return this.schoolPatchTrip(userId, tripId, { status: 'cancelled', cancelReason: reason });
    }
    async schoolTripLive(userId, tripId) {
        const trip = await this.schoolGetTrip(userId, tripId);
        return {
            tripId,
            status: trip.status,
            vehicleLocation: { lat: 0.3476, lng: 32.5825 },
            updatedAt: Date.now(),
        };
    }
    async schoolListAttendants(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.getSchoolStore(fleetId).attendants;
    }
    async schoolCreateAttendant(userId, input) {
        const fleetId = await this.getFleetId(userId);
        const store = this.getSchoolStore(fleetId);
        const created = { id: (0, uuid_1.v4)(), ...input, createdAt: Date.now(), updatedAt: Date.now() };
        store.attendants.unshift(created);
        return created;
    }
    async schoolGetAttendant(userId, attendantId) {
        const fleetId = await this.getFleetId(userId);
        const attendant = this.getSchoolStore(fleetId).attendants.find((item) => item.id === attendantId);
        if (!attendant)
            throw new common_1.NotFoundException('Attendant not found');
        return attendant;
    }
    async schoolPatchAttendant(userId, attendantId, patch) {
        const attendant = await this.schoolGetAttendant(userId, attendantId);
        Object.assign(attendant, patch, { updatedAt: Date.now() });
        return attendant;
    }
    async schoolDeleteAttendant(userId, attendantId) {
        const fleetId = await this.getFleetId(userId);
        const store = this.getSchoolStore(fleetId);
        const next = store.attendants.filter((item) => item.id !== attendantId);
        if (next.length === store.attendants.length)
            throw new common_1.NotFoundException('Attendant not found');
        store.attendants = next;
        return { deleted: true };
    }
    async schoolListPayments(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.getSchoolStore(fleetId).payments;
    }
    async schoolCreatePayment(userId, input) {
        const fleetId = await this.getFleetId(userId);
        const store = this.getSchoolStore(fleetId);
        const created = { id: (0, uuid_1.v4)(), ...input, createdAt: Date.now() };
        store.payments.unshift(created);
        return created;
    }
    async schoolListFeedback(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.getSchoolStore(fleetId).feedback;
    }
    async schoolCreateFeedback(userId, input) {
        const fleetId = await this.getFleetId(userId);
        const store = this.getSchoolStore(fleetId);
        const created = { id: (0, uuid_1.v4)(), ...input, createdAt: Date.now() };
        store.feedback.unshift(created);
        return created;
    }
    async schoolRoster(userId, routeId) {
        const students = await this.schoolListStudents(userId);
        if (!routeId)
            return students;
        return students.filter((item) => item.routeId === routeId);
    }
    async schoolTripCalendar(userId, date) {
        const trips = await this.schoolListTrips(userId);
        if (!date)
            return trips;
        return trips.filter((trip) => String(trip.date || trip.scheduledDate || '').startsWith(date));
    }
    async schoolPerformanceReport(userId) {
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
    async schoolBulkReminders(userId, input) {
        await this.getFleetId(userId);
        return {
            sent: true,
            message: input.message,
            target: input.target || 'all',
            sentAt: Date.now(),
        };
    }
    publishFleetSyncEvent(userId, event, payload) {
        this.fleetRealtimeGateway.publishToUser(userId, event, payload);
        this.fleetRealtimeGateway.publishToUser(userId, 'notification.new', payload);
    }
    async getFleetId(userId) {
        const user = await this.prisma.user.findFirst({ where: { id: userId } });
        return user?.fleetId ?? userId;
    }
    async ensureBranchBelongsToFleet(fleetId, branchId) {
        if (!branchId)
            return;
        const branch = await this.prisma.fleetBranch.findFirst({ where: { id: branchId, fleetId } });
        if (!branch) {
            throw new common_1.BadRequestException('Branch does not belong to this fleet');
        }
    }
    async ensureFleetDriver(fleetId, driverId) {
        if (!driverId)
            return;
        const driver = await this.prisma.fleetDriver.findFirst({ where: { fleetId, driverId } });
        if (!driver) {
            throw new common_1.BadRequestException('Driver does not belong to this fleet');
        }
    }
    async ensureFleetVehicle(fleetId, vehicleId) {
        if (!vehicleId)
            return;
        const vehicle = await this.prisma.vehicle.findFirst({ where: { fleetId, id: vehicleId } });
        if (!vehicle) {
            throw new common_1.BadRequestException('Vehicle does not belong to this fleet');
        }
    }
    async getFleetEarningsEvents(fleetId, period) {
        const drivers = await this.prisma.fleetDriver.findMany({ where: { fleetId } });
        const driverIds = drivers.map((d) => d.driverId).filter(Boolean);
        const now = new Date();
        let threshold = null;
        if (period) {
            threshold = new Date();
            if (period === 'day')
                threshold.setDate(now.getDate() - 1);
            else if (period === 'week')
                threshold.setDate(now.getDate() - 7);
            else if (period === 'month')
                threshold.setMonth(now.getMonth() - 1);
            else if (period === 'quarter')
                threshold.setMonth(now.getMonth() - 3);
            else if (period === 'year')
                threshold.setFullYear(now.getFullYear() - 1);
        }
        const where = { userId: { in: driverIds } };
        if (threshold) {
            where.createdAt = { gte: threshold };
        }
        return this.prisma.earningsLedger.findMany({ where });
    }
};
exports.FleetService = FleetService;
exports.FleetService = FleetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        scoped_realtime_gateway_1.FleetRealtimeGateway])
], FleetService);
//# sourceMappingURL=fleet.service.js.map