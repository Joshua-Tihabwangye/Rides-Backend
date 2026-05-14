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
const prisma_service_1 = require("../prisma/prisma.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const scoped_realtime_gateway_1 = require("../realtime/scoped-realtime.gateway");
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
    constructor(prisma, realtimeGateway, riderRealtimeGateway) {
        this.prisma = prisma;
        this.realtimeGateway = realtimeGateway;
        this.riderRealtimeGateway = riderRealtimeGateway;
    }
    async getActive(driverId) {
        return this.prisma.trip.findFirst({
            where: {
                driverId,
                status: { in: ['driver_assigned', 'driver_arriving', 'arrived', 'in_progress'] },
            },
        });
    }
    async list(driverId, query) {
        const where = { driverId };
        if (query.type)
            where.type = query.type;
        if (query.status)
            where.status = query.status;
        const trips = await this.prisma.trip.findMany({
            where,
            take: 50,
            orderBy: { createdAt: 'desc' },
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
        const updated = await this.prisma.trip.update({
            where: { id: tripId },
            data: { driverArrivedAt: new Date() },
        });
        this.publishTripEvent(updated, 'trip.arrived');
        return updated;
    }
    async verifyRider(driverId, tripId, otp) {
        const trip = await this.getById(driverId, tripId);
        if (trip.status !== 'arrived') {
            throw new common_1.BadRequestException('Trip must be in arrived state before rider verification');
        }
        if (trip.otpCode !== otp) {
            throw new common_1.BadRequestException('Invalid rider OTP');
        }
        const updated = await this.prisma.trip.update({
            where: { id: tripId },
            data: { rating: { riderVerifiedAt: Date.now() } },
        });
        this.publishTripEvent(updated, 'trip.rider.verified');
        return updated;
    }
    async start(driverId, tripId) {
        const trip = await this.getById(driverId, tripId);
        const rating = trip.rating;
        if (!rating?.riderVerifiedAt && trip.type !== 'delivery') {
        }
        const nextTrip = await this.transition(driverId, tripId, 'in_progress');
        const updated = await this.prisma.trip.update({
            where: { id: tripId },
            data: { startedAt: new Date() },
        });
        this.publishTripEvent(updated, 'trip.started');
        return updated;
    }
    async complete(driverId, tripId) {
        const trip = await this.transition(driverId, tripId, 'completed');
        const updated = await this.prisma.trip.update({
            where: { id: tripId },
            data: { completedAt: new Date() },
        });
        await this.prisma.earningsLedger.create({
            data: {
                userId: driverId,
                driverId,
                tripId,
                amount: 12000,
                type: 'trip_fare',
            },
        });
        const wallet = await this.prisma.walletAccount.findFirst({ where: { userId: driverId } });
        if (wallet) {
            await this.prisma.walletAccount.update({
                where: { id: wallet.id },
                data: { balance: Number(wallet.balance) + 12000 },
            });
        }
        this.publishTripEvent(updated, 'trip.completed');
        return updated;
    }
    async cancel(driverId, tripId, reason, details, cancelledBy = 'driver') {
        const trip = await this.transition(driverId, tripId, 'cancelled');
        const updated = await this.prisma.trip.update({
            where: { id: tripId },
            data: {
                cancelledAt: new Date(),
                cancellationReason: {
                    reason,
                    details: details ?? '',
                    cancelledBy,
                    cancelledAt: Date.now(),
                },
            },
        });
        this.publishTripEvent(updated, 'trip.cancelled');
        return updated;
    }
    async assignDriver(driverId, tripId, jobId) {
        const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        await this.prisma.trip.update({
            where: { id: tripId },
            data: { driverId, route: { ...trip.route, jobId } },
        });
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
        const job = await this.prisma.jobOffer.findFirst({ where: { id: jobId, driverId } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        return job;
    }
    publishTripEvent(trip, event) {
        const payload = {
            tripId: trip.id,
            driverId: trip.driverId,
            riderId: trip.riderId,
            status: trip.status,
            updatedAt: trip.updatedAt,
        };
        this.realtimeGateway?.publishEvent({
            driverId: trip.driverId,
            tripId: trip.id,
            event,
            payload,
        });
        this.riderRealtimeGateway?.publishToUser(trip.riderId, event, payload);
    }
    async transition(driverId, tripId, next) {
        const trip = await this.getById(driverId, tripId);
        const allowed = TRANSITIONS[trip.status] ?? [];
        if (!allowed.includes(next)) {
            throw new common_1.BadRequestException(`Invalid trip state transition from ${trip.status} to ${next}`);
        }
        return this.prisma.trip.update({ where: { id: tripId }, data: { status: next } });
    }
    async ensureDriverMatch(trip, driverId) {
        if (trip.driverId && trip.driverId !== driverId) {
            throw new common_1.NotFoundException('Trip not found');
        }
        return this.prisma.trip.update({ where: { id: trip.id }, data: { driverId } });
    }
    async getByIdOrPending(driverId, tripId) {
        const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        return this.ensureDriverMatch(trip, driverId);
    }
    async getById(driverId, tripId) {
        const trip = await this.prisma.trip.findFirst({ where: { id: tripId, driverId } });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        return trip;
    }
    async hydrateTripFromJob(job) {
        const trip = await this.prisma.trip.findUnique({ where: { id: job.tripId } });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        return this.prisma.trip.update({
            where: { id: trip.id },
            data: { driverId: job.driverId, route: { ...trip.route, jobId: job.id } },
        });
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_gateway_1.RealtimeGateway,
        scoped_realtime_gateway_1.RiderRealtimeGateway])
], TripsService);
//# sourceMappingURL=trips.service.js.map