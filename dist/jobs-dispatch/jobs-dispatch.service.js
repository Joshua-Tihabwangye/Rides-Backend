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
exports.JobsDispatchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const trips_service_1 = require("../trips/trips.service");
let JobsDispatchService = class JobsDispatchService {
    constructor(prisma, tripsService, realtimeGateway) {
        this.prisma = prisma;
        this.tripsService = tripsService;
        this.realtimeGateway = realtimeGateway;
    }
    async list(driverId, query) {
        const where = { driverId };
        if (query.status)
            where.status = query.status;
        if (query.type)
            where.type = query.type;
        return this.prisma.jobOffer.findMany({ where });
    }
    async getActive(driverId) {
        return this.prisma.jobOffer.findFirst({
            where: {
                driverId,
                status: { in: ['accepted', 'in_progress'] },
            },
        });
    }
    async accept(driverId, jobId) {
        const job = await this.prisma.jobOffer.findFirst({ where: { id: jobId, driverId } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        if (!['offered', 'pending'].includes(job.status)) {
            throw new common_1.BadRequestException(`Job cannot be accepted from ${job.status} state`);
        }
        const updatedJob = await this.prisma.jobOffer.update({
            where: { id: jobId },
            data: { status: 'accepted', respondedAt: new Date() },
        });
        const trip = await this.tripsService.startFromJob(driverId, job.id);
        await this.tripsService.markEnRoute(driverId, trip.id);
        await this.prisma.jobOffer.updateMany({
            where: { tripId: job.tripId, status: 'offered', id: { not: job.id } },
            data: { status: 'cancelled', respondedAt: new Date() },
        });
        this.realtimeGateway?.publishEvent({
            driverId,
            tripId: trip.id,
            event: 'job.offer.updated',
            payload: {
                jobId: job.id,
                tripId: trip.id,
                driverId,
                status: updatedJob.status,
                respondedAt: updatedJob.respondedAt,
            },
        });
        return {
            job: updatedJob,
            trip,
        };
    }
    async reject(driverId, jobId, reason = '') {
        const job = await this.prisma.jobOffer.findFirst({ where: { id: jobId, driverId } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        if (!['offered', 'pending'].includes(job.status)) {
            throw new common_1.BadRequestException(`Job cannot be rejected from ${job.status} state`);
        }
        const updatedJob = await this.prisma.jobOffer.update({
            where: { id: jobId },
            data: { status: 'rejected', respondedAt: new Date() },
        });
        this.realtimeGateway?.publishEvent({
            driverId,
            tripId: job.tripId,
            event: 'job.offer.updated',
            payload: {
                jobId: job.id,
                tripId: job.tripId,
                driverId,
                status: updatedJob.status,
                reason,
                respondedAt: updatedJob.respondedAt,
            },
        });
        return { jobId, rejected: true, reason };
    }
};
exports.JobsDispatchService = JobsDispatchService;
exports.JobsDispatchService = JobsDispatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        trips_service_1.TripsService,
        realtime_gateway_1.RealtimeGateway])
], JobsDispatchService);
//# sourceMappingURL=jobs-dispatch.service.js.map