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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fleet_partner_profile_entity_1 = require("../entities/fleet-partner-profile.entity");
const fleet_branch_entity_1 = require("../entities/fleet-branch.entity");
const fleet_driver_entity_1 = require("../entities/fleet-driver.entity");
const fleet_dispatch_entity_1 = require("../entities/fleet-dispatch.entity");
const fleet_service_record_entity_1 = require("../entities/fleet-service-record.entity");
const fleet_payout_entity_1 = require("../entities/fleet-payout.entity");
const fleet_compliance_incident_entity_1 = require("../entities/fleet-compliance-incident.entity");
const fleet_training_course_entity_1 = require("../entities/fleet-training-course.entity");
const user_entity_1 = require("../entities/user.entity");
const driver_profile_entity_1 = require("../entities/driver-profile.entity");
const trip_entity_1 = require("../entities/trip.entity");
const job_offer_entity_1 = require("../entities/job-offer.entity");
const earnings_ledger_entity_1 = require("../entities/earnings-ledger.entity");
const vehicle_entity_1 = require("../entities/vehicle.entity");
const rider_service_request_entity_1 = require("../entities/rider-service-request.entity");
const scoped_realtime_gateway_1 = require("../realtime/scoped-realtime.gateway");
const uuid_1 = require("uuid");
let FleetService = class FleetService {
    constructor(fleetProfileRepo, fleetBranchRepo, fleetDriverRepo, fleetDispatchRepo, fleetServiceRepo, fleetPayoutRepo, complianceRepo, trainingRepo, userRepo, driverProfileRepo, tripRepo, jobOfferRepo, earningsLedgerRepo, vehicleRepo, riderServiceRequestRepo, fleetRealtimeGateway) {
        this.fleetProfileRepo = fleetProfileRepo;
        this.fleetBranchRepo = fleetBranchRepo;
        this.fleetDriverRepo = fleetDriverRepo;
        this.fleetDispatchRepo = fleetDispatchRepo;
        this.fleetServiceRepo = fleetServiceRepo;
        this.fleetPayoutRepo = fleetPayoutRepo;
        this.complianceRepo = complianceRepo;
        this.trainingRepo = trainingRepo;
        this.userRepo = userRepo;
        this.driverProfileRepo = driverProfileRepo;
        this.tripRepo = tripRepo;
        this.jobOfferRepo = jobOfferRepo;
        this.earningsLedgerRepo = earningsLedgerRepo;
        this.vehicleRepo = vehicleRepo;
        this.riderServiceRequestRepo = riderServiceRequestRepo;
        this.fleetRealtimeGateway = fleetRealtimeGateway;
        this.schoolOpsStore = new Map();
    }
    async getProfile(userId) {
        const fleetId = await this.getFleetId(userId);
        const profile = await this.fleetProfileRepo.findOne({ where: { fleetId } });
        if (!profile) {
            throw new common_1.NotFoundException('Fleet profile not found');
        }
        return profile;
    }
    async updateProfile(userId, patch) {
        const profile = await this.getProfile(userId);
        Object.assign(profile, patch);
        return this.fleetProfileRepo.save(profile);
    }
    async listBranches(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.fleetBranchRepo.find({ where: { fleetId } });
    }
    async createBranch(userId, input) {
        const fleetId = await this.getFleetId(userId);
        const branch = this.fleetBranchRepo.create({
            fleetId,
            ...input,
        });
        return this.fleetBranchRepo.save(branch);
    }
    async patchBranch(userId, branchId, patch) {
        const fleetId = await this.getFleetId(userId);
        const branch = await this.fleetBranchRepo.findOne({ where: { id: branchId, fleetId } });
        if (!branch) {
            throw new common_1.NotFoundException('Fleet branch not found');
        }
        Object.assign(branch, patch);
        return this.fleetBranchRepo.save(branch);
    }
    async deleteBranch(userId, branchId) {
        const fleetId = await this.getFleetId(userId);
        const result = await this.fleetBranchRepo.delete({ id: branchId, fleetId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Fleet branch not found');
        }
        return { deleted: true };
    }
    async listDrivers(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.fleetDriverRepo.find({ where: { fleetId } });
    }
    async createDriver(userId, input) {
        const fleetId = await this.getFleetId(userId);
        await this.ensureBranchBelongsToFleet(fleetId, input.branchId);
        const driverId = (0, uuid_1.v4)();
        const userRecordId = (0, uuid_1.v4)();
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
    async patchDriver(userId, driverId, patch) {
        const fleetId = await this.getFleetId(userId);
        await this.ensureBranchBelongsToFleet(fleetId, patch.branchId);
        const fleetDriver = await this.fleetDriverRepo.findOne({ where: { driverId, fleetId } });
        if (!fleetDriver) {
            throw new common_1.NotFoundException('Fleet driver not found');
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
    async listDispatches(userId, type) {
        const fleetId = await this.getFleetId(userId);
        const where = { fleetId };
        if (type)
            where.type = type;
        return this.fleetDispatchRepo.find({ where });
    }
    async createDispatch(userId, input, forcedType) {
        const fleetId = await this.getFleetId(userId);
        const type = forcedType ?? input.type ?? 'ride';
        await this.ensureFleetDriver(fleetId, input.driverId);
        await this.ensureFleetVehicle(fleetId, input.vehicleId);
        const tripId = (0, uuid_1.v4)();
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
            type: type,
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
                type: type,
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
    async listTrips(userId) {
        const fleetId = await this.getFleetId(userId);
        const drivers = await this.fleetDriverRepo.find({ where: { fleetId } });
        const driverIds = drivers.map(d => d.driverId);
        return this.tripRepo.find({
            where: [
                { fleetId },
                { driverId: (0, typeorm_2.In)(driverIds) }
            ]
        });
    }
    async listServices(userId, service) {
        const fleetId = await this.getFleetId(userId);
        return this.fleetServiceRepo.find({ where: { fleetId, service } });
    }
    async createService(userId, service, input) {
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
        return this.fleetPayoutRepo.find({ where: { fleetId } });
    }
    async listComplianceIncidents(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.complianceRepo.find({ where: { fleetId } });
    }
    async createComplianceIncident(userId, input) {
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
    async listTrainingCourses(userId) {
        const fleetId = await this.getFleetId(userId);
        return this.trainingRepo.find({ where: { fleetId } });
    }
    async createTrainingCourse(userId, input) {
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
    async listRiderServiceRequests(userId, query = {}) {
        await this.getFleetId(userId);
        const where = {};
        if (query.serviceType)
            where.serviceType = query.serviceType;
        if (query.status)
            where.status = query.status;
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
    async getBranchById(userId, branchId) {
        const fleetId = await this.getFleetId(userId);
        const branch = await this.fleetBranchRepo.findOne({ where: { id: branchId, fleetId } });
        if (!branch) {
            throw new common_1.NotFoundException('Fleet branch not found');
        }
        return branch;
    }
    async getDriverById(userId, driverId) {
        const fleetId = await this.getFleetId(userId);
        const driver = await this.fleetDriverRepo.findOne({ where: { fleetId, driverId } });
        if (!driver) {
            throw new common_1.NotFoundException('Fleet driver not found');
        }
        return driver;
    }
    async deleteDriver(userId, driverId) {
        const fleetId = await this.getFleetId(userId);
        const result = await this.fleetDriverRepo.delete({ fleetId, driverId });
        if (!result.affected) {
            throw new common_1.NotFoundException('Fleet driver not found');
        }
        return { deleted: true };
    }
    async removeVehicle(userId, vehicleId) {
        const fleetId = await this.getFleetId(userId);
        const result = await this.vehicleRepo.delete({ id: vehicleId, fleetId });
        if (!result.affected) {
            throw new common_1.NotFoundException('Fleet vehicle not found');
        }
        return { deleted: true };
    }
    async listVehicleDocuments(userId, vehicleId) {
        const fleetId = await this.getFleetId(userId);
        const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, fleetId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Fleet vehicle not found');
        }
        const documents = vehicle.documents || {};
        return Object.entries(documents).map(([documentType, payload]) => ({ documentType, ...payload }));
    }
    async createVehicleDocument(userId, vehicleId, input) {
        const fleetId = await this.getFleetId(userId);
        const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, fleetId } });
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
        vehicle.documents = documents;
        await this.vehicleRepo.save(vehicle);
        return { documentType: input.documentType, ...documents[input.documentType] };
    }
    async listVehicleMaintenanceHistory(userId, vehicleId) {
        const fleetId = await this.getFleetId(userId);
        const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, fleetId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Fleet vehicle not found');
        }
        const accessories = vehicle.accessories || {};
        const history = Array.isArray(accessories.maintenanceHistory) ? accessories.maintenanceHistory : [];
        return history;
    }
    async createVehicleMaintenanceRecord(userId, vehicleId, input) {
        const fleetId = await this.getFleetId(userId);
        const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, fleetId } });
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
        vehicle.accessories = accessories;
        await this.vehicleRepo.save(vehicle);
        return record;
    }
    async getDispatchById(userId, dispatchId) {
        const fleetId = await this.getFleetId(userId);
        const dispatch = await this.fleetDispatchRepo.findOne({ where: { id: dispatchId, fleetId } });
        if (!dispatch) {
            throw new common_1.NotFoundException('Fleet dispatch not found');
        }
        return dispatch;
    }
    async patchDispatch(userId, dispatchId, patch) {
        const fleetId = await this.getFleetId(userId);
        const dispatch = await this.fleetDispatchRepo.findOne({ where: { id: dispatchId, fleetId } });
        if (!dispatch) {
            throw new common_1.NotFoundException('Fleet dispatch not found');
        }
        await this.ensureFleetDriver(fleetId, patch.driverId);
        await this.ensureFleetVehicle(fleetId, patch.vehicleId);
        Object.assign(dispatch, patch);
        return this.fleetDispatchRepo.save(dispatch);
    }
    async deleteDispatch(userId, dispatchId) {
        const fleetId = await this.getFleetId(userId);
        const result = await this.fleetDispatchRepo.delete({ id: dispatchId, fleetId });
        if (!result.affected) {
            throw new common_1.NotFoundException('Fleet dispatch not found');
        }
        return { deleted: true };
    }
    async assignDispatch(userId, dispatchId, input) {
        const patched = await this.patchDispatch(userId, dispatchId, {
            driverId: input.driverId,
            vehicleId: input.vehicleId,
            status: input.driverId ? 'assigned' : 'pending',
        });
        return patched;
    }
    async getServiceById(userId, service, serviceId) {
        const fleetId = await this.getFleetId(userId);
        const record = await this.fleetServiceRepo.findOne({ where: { id: serviceId, fleetId, service } });
        if (!record) {
            throw new common_1.NotFoundException('Fleet service record not found');
        }
        return record;
    }
    async patchServiceById(userId, service, serviceId, patch) {
        const fleetId = await this.getFleetId(userId);
        const record = await this.fleetServiceRepo.findOne({ where: { id: serviceId, fleetId, service } });
        if (!record) {
            throw new common_1.NotFoundException('Fleet service record not found');
        }
        await this.ensureFleetVehicle(fleetId, patch.assetId);
        Object.assign(record, patch);
        return this.fleetServiceRepo.save(record);
    }
    async cancelServiceById(userId, service, serviceId, reason) {
        return this.patchServiceById(userId, service, serviceId, { status: 'cancelled', notes: reason });
    }
    async getComplianceIncidentById(userId, incidentId) {
        const fleetId = await this.getFleetId(userId);
        const incident = await this.complianceRepo.findOne({ where: { id: incidentId, fleetId } });
        if (!incident) {
            throw new common_1.NotFoundException('Compliance incident not found');
        }
        return incident;
    }
    async patchComplianceIncidentById(userId, incidentId, patch) {
        const fleetId = await this.getFleetId(userId);
        const incident = await this.complianceRepo.findOne({ where: { id: incidentId, fleetId } });
        if (!incident) {
            throw new common_1.NotFoundException('Compliance incident not found');
        }
        Object.assign(incident, patch);
        return this.complianceRepo.save(incident);
    }
    async getTrainingCourseById(userId, courseId) {
        const fleetId = await this.getFleetId(userId);
        const course = await this.trainingRepo.findOne({ where: { id: courseId, fleetId } });
        if (!course) {
            throw new common_1.NotFoundException('Training course not found');
        }
        return course;
    }
    async patchTrainingCourseById(userId, courseId, patch) {
        const fleetId = await this.getFleetId(userId);
        await this.ensureFleetDriver(fleetId, patch.assignedTo);
        const course = await this.trainingRepo.findOne({ where: { id: courseId, fleetId } });
        if (!course) {
            throw new common_1.NotFoundException('Training course not found');
        }
        Object.assign(course, patch);
        return this.trainingRepo.save(course);
    }
    async deleteTrainingCourseById(userId, courseId) {
        const fleetId = await this.getFleetId(userId);
        const result = await this.trainingRepo.delete({ id: courseId, fleetId });
        if (!result.affected) {
            throw new common_1.NotFoundException('Training course not found');
        }
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
        const payout = await this.fleetPayoutRepo.findOne({ where: { id: payoutId, fleetId } });
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
        const user = await this.userRepo.findOne({ where: { id: userId } });
        return user?.fleetId ?? userId;
    }
    async ensureBranchBelongsToFleet(fleetId, branchId) {
        if (!branchId)
            return;
        const branch = await this.fleetBranchRepo.findOne({ where: { id: branchId, fleetId } });
        if (!branch) {
            throw new common_1.BadRequestException('Branch does not belong to this fleet');
        }
    }
    async ensureFleetDriver(fleetId, driverId) {
        if (!driverId)
            return;
        const driver = await this.fleetDriverRepo.findOne({ where: { fleetId, driverId } });
        if (!driver) {
            throw new common_1.BadRequestException('Driver does not belong to this fleet');
        }
    }
    async ensureFleetVehicle(fleetId, vehicleId) {
        if (!vehicleId)
            return;
        const vehicle = await this.vehicleRepo.findOne({ where: { fleetId, id: vehicleId } });
        if (!vehicle) {
            throw new common_1.BadRequestException('Vehicle does not belong to this fleet');
        }
    }
    async getFleetEarningsEvents(fleetId, period) {
        const drivers = await this.fleetDriverRepo.find({ where: { fleetId } });
        const driverIds = drivers.map(d => d.driverId);
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
        const where = [
            { userId: (0, typeorm_2.In)(driverIds) }
        ];
        if (threshold) {
            return this.earningsLedgerRepo.find({
                where: [
                    { userId: (0, typeorm_2.In)(driverIds), createdAt: (0, typeorm_2.MoreThanOrEqual)(threshold) }
                ]
            });
        }
        return this.earningsLedgerRepo.find({
            where: [
                { userId: (0, typeorm_2.In)(driverIds) }
            ]
        });
    }
};
exports.FleetService = FleetService;
exports.FleetService = FleetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fleet_partner_profile_entity_1.FleetPartnerProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(fleet_branch_entity_1.FleetBranch)),
    __param(2, (0, typeorm_1.InjectRepository)(fleet_driver_entity_1.FleetDriver)),
    __param(3, (0, typeorm_1.InjectRepository)(fleet_dispatch_entity_1.FleetDispatch)),
    __param(4, (0, typeorm_1.InjectRepository)(fleet_service_record_entity_1.FleetServiceRecord)),
    __param(5, (0, typeorm_1.InjectRepository)(fleet_payout_entity_1.FleetPayout)),
    __param(6, (0, typeorm_1.InjectRepository)(fleet_compliance_incident_entity_1.FleetComplianceIncident)),
    __param(7, (0, typeorm_1.InjectRepository)(fleet_training_course_entity_1.FleetTrainingCourse)),
    __param(8, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(9, (0, typeorm_1.InjectRepository)(driver_profile_entity_1.DriverProfile)),
    __param(10, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __param(11, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __param(12, (0, typeorm_1.InjectRepository)(earnings_ledger_entity_1.EarningsLedger)),
    __param(13, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(14, (0, typeorm_1.InjectRepository)(rider_service_request_entity_1.RiderServiceRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        scoped_realtime_gateway_1.FleetRealtimeGateway])
], FleetService);
//# sourceMappingURL=fleet.service.js.map