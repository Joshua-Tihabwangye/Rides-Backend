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
const uuid_1 = require("uuid");
let FleetService = class FleetService {
    constructor(fleetProfileRepo, fleetBranchRepo, fleetDriverRepo, fleetDispatchRepo, fleetServiceRepo, fleetPayoutRepo, complianceRepo, trainingRepo, userRepo, driverProfileRepo, tripRepo, jobOfferRepo, earningsLedgerRepo, vehicleRepo) {
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
        await this.fleetDispatchRepo.save(dispatch);
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
        return { dispatch, trip };
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
        return this.complianceRepo.save(incident);
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
        return this.trainingRepo.save(course);
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
        typeorm_2.Repository])
], FleetService);
//# sourceMappingURL=fleet.service.js.map