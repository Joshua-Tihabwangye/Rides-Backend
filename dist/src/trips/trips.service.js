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
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const trip_entity_1 = require("../entities/trip.entity");
const job_offer_entity_1 = require("../entities/job-offer.entity");
const earnings_ledger_entity_1 = require("../entities/earnings-ledger.entity");
const wallet_account_entity_1 = require("../entities/wallet-account.entity");
const TRANSITIONS = {
    requested: ['driver_assigned', 'cancelled'],
    driver_assigned: ['driver_arriving', 'cancelled'],
    driver_arriving: ['arrived', 'cancelled'],
    arrived: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
};
let TripsService = class TripsService {
    constructor(tripRepo, jobOfferRepo, earningsLedgerRepo, walletRepo, realtimeGateway) {
        this.tripRepo = tripRepo;
        this.jobOfferRepo = jobOfferRepo;
        this.earningsLedgerRepo = earningsLedgerRepo;
        this.walletRepo = walletRepo;
        this.realtimeGateway = realtimeGateway;
    }
    async getActive(driverId) {
        const trip = await this.tripRepo.findOne({
            where: [
                { driverId, status: 'driver_assigned' },
                { driverId, status: 'driver_arriving' },
                { driverId, status: 'arrived' },
                { driverId, status: 'in_progress' },
            ],
        });
        return trip ?? null;
    }
    async list(driverId, query) {
        const where = { driverId };
        if (query.type)
            where.type = query.type;
        if (query.status)
            where.status = query.status;
        const trips = await this.tripRepo.find({
            where,
            take: 50,
            order: { createdAt: 'DESC' },
        });
        return {
            items: trips,
            nextCursor: trips.length === 50 ? trips[trips.length - 1].id : null,
        };
    }
    async startFromJob(driverId, jobId) {
        const job = await this.getJobForDriver(driverId, jobId);
        return this.assignDriver(driverId, job.tripId, job.id);
    }
    async arrive(driverId, tripId) {
        const trip = await this.transition(driverId, tripId, 'arrived');
        trip.driverArrivedAt = new Date();
        await this.tripRepo.save(trip);
        this.publishTripEvent(trip, 'trip.arrived');
        return trip;
    }
    async verifyRider(driverId, tripId, otp) {
        const trip = await this.getById(driverId, tripId);
        if (trip.status !== 'arrived') {
            throw new common_1.BadRequestException('Trip must be in arrived state before rider verification');
        }
        if (trip.otpCode !== otp) {
            throw new common_1.BadRequestException('Invalid rider OTP');
        }
        trip.rating = { riderVerifiedAt: Date.now() };
        await this.tripRepo.save(trip);
        this.publishTripEvent(trip, 'trip.rider.verified');
        return trip;
    }
    async start(driverId, tripId) {
        const trip = await this.getById(driverId, tripId);
        if (!trip.rating?.riderVerifiedAt && trip.type !== 'delivery') {
        }
        const nextTrip = await this.transition(driverId, tripId, 'in_progress');
        nextTrip.startedAt = new Date();
        await this.tripRepo.save(nextTrip);
        this.publishTripEvent(nextTrip, 'trip.started');
        return nextTrip;
    }
    async complete(driverId, tripId) {
        const trip = await this.transition(driverId, tripId, 'completed');
        trip.completedAt = new Date();
        await this.tripRepo.save(trip);
        const earning = this.earningsLedgerRepo.create({
            userId: driverId,
            tripId,
            amount: 12000,
            type: 'trip_fare',
        });
        await this.earningsLedgerRepo.save(earning);
        const wallet = await this.walletRepo.findOne({ where: { userId: driverId } });
        if (wallet) {
            wallet.balance = Number(wallet.balance) + 12000;
            await this.walletRepo.save(wallet);
        }
        this.publishTripEvent(trip, 'trip.completed');
        return trip;
    }
    async cancel(driverId, tripId, reason, details, cancelledBy = 'driver') {
        const trip = await this.transition(driverId, tripId, 'cancelled');
        trip.cancelledAt = new Date();
        trip.cancellationReason = {
            reason,
            details: details ?? '',
            cancelledBy,
            cancelledAt: Date.now(),
        };
        await this.tripRepo.save(trip);
        this.publishTripEvent(trip, 'trip.cancelled');
        return trip;
    }
    async assignDriver(driverId, tripId, jobId) {
        const trip = await this.tripRepo.findOne({ where: { id: tripId } });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        trip.driverId = driverId;
        trip.route = { ...trip.route, jobId };
        await this.tripRepo.save(trip);
        const assignedTrip = await this.transition(driverId, tripId, 'driver_assigned');
        this.publishTripEvent(assignedTrip, 'trip.driver.assigned');
        return assignedTrip;
    }
    async markEnRoute(driverId, tripId) {
        const trip = await this.transition(driverId, tripId, 'driver_arriving');
        this.publishTripEvent(trip, 'trip.driver.arriving');
        return trip;
    }
    async getJobForDriver(driverId, jobId) {
        const job = await this.jobOfferRepo.findOne({ where: { id: jobId, driverId } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        return job;
    }
    publishTripEvent(trip, event) {
        this.realtimeGateway?.publishEvent({
            driverId: trip.driverId,
            tripId: trip.id,
            event,
            payload: {
                tripId: trip.id,
                driverId: trip.driverId,
                riderId: trip.riderId,
                status: trip.status,
                updatedAt: trip.updatedAt,
            },
        });
    }
    async transition(driverId, tripId, next) {
        const trip = await this.getById(driverId, tripId);
        const allowed = TRANSITIONS[trip.status] ?? [];
        if (!allowed.includes(next)) {
            throw new common_1.BadRequestException(`Invalid trip state transition from ${trip.status} to ${next}`);
        }
        trip.status = next;
        return this.tripRepo.save(trip);
    }
    async ensureDriverMatch(trip, driverId) {
        if (trip.driverId && trip.driverId !== driverId) {
            throw new common_1.NotFoundException('Trip not found');
        }
        trip.driverId = driverId;
        return this.tripRepo.save(trip);
    }
    async getByIdOrPending(driverId, tripId) {
        const trip = await this.tripRepo.findOne({ where: { id: tripId } });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        return this.ensureDriverMatch(trip, driverId);
    }
    async getById(driverId, tripId) {
        const trip = await this.tripRepo.findOne({ where: { id: tripId, driverId } });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        return trip;
    }
    async hydrateTripFromJob(job) {
        const trip = await this.tripRepo.findOne({ where: { id: job.tripId } });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        trip.driverId = job.driverId;
        trip.route = { ...trip.route, jobId: job.id };
        return this.tripRepo.save(trip);
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __param(1, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __param(2, (0, typeorm_1.InjectRepository)(earnings_ledger_entity_1.EarningsLedger)),
    __param(3, (0, typeorm_1.InjectRepository)(wallet_account_entity_1.WalletAccount)),
    __param(4, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], TripsService);
//# sourceMappingURL=trips.service.js.map