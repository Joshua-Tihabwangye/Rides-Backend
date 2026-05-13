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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_offer_entity_1 = require("../entities/job-offer.entity");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const trips_service_1 = require("../trips/trips.service");
let JobsDispatchService = class JobsDispatchService {
    constructor(jobRepo, tripsService, realtimeGateway) {
        this.jobRepo = jobRepo;
        this.tripsService = tripsService;
        this.realtimeGateway = realtimeGateway;
    }
    async list(driverId, query) {
        const where = { driverId };
        if (query.status)
            where.status = query.status;
        if (query.type)
            where.type = query.type;
        return this.jobRepo.find({ where });
    }
    async getActive(driverId) {
        return this.jobRepo.findOne({
            where: {
                driverId,
                status: (0, typeorm_2.In)(['accepted', 'in_progress']),
            },
        });
    }
    async accept(driverId, jobId) {
        const job = await this.jobRepo.findOne({ where: { id: jobId, driverId } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        if (!['offered', 'pending'].includes(job.status)) {
            throw new common_1.BadRequestException(`Job cannot be accepted from ${job.status} state`);
        }
        job.status = 'accepted';
        job.respondedAt = new Date();
        await this.jobRepo.save(job);
        const trip = await this.tripsService.startFromJob(driverId, job.id);
        await this.tripsService.markEnRoute(driverId, trip.id);
        const peerJobs = await this.jobRepo.find({ where: { tripId: job.tripId, status: 'offered' } });
        for (const peerJob of peerJobs) {
            if (peerJob.id !== job.id) {
                peerJob.status = 'cancelled';
                peerJob.respondedAt = new Date();
                await this.jobRepo.save(peerJob);
            }
        }
        this.realtimeGateway?.publishEvent({
            driverId,
            tripId: trip.id,
            event: 'job.offer.updated',
            payload: {
                jobId: job.id,
                tripId: trip.id,
                driverId,
                status: job.status,
                respondedAt: job.respondedAt,
            },
        });
        return {
            job,
            trip,
        };
    }
    async reject(driverId, jobId, reason = '') {
        const job = await this.jobRepo.findOne({ where: { id: jobId, driverId } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        if (!['offered', 'pending'].includes(job.status)) {
            throw new common_1.BadRequestException(`Job cannot be rejected from ${job.status} state`);
        }
        job.status = 'rejected';
        job.respondedAt = new Date();
        await this.jobRepo.save(job);
        this.realtimeGateway?.publishEvent({
            driverId,
            tripId: job.tripId,
            event: 'job.offer.updated',
            payload: {
                jobId: job.id,
                tripId: job.tripId,
                driverId,
                status: job.status,
                reason,
                respondedAt: job.respondedAt,
            },
        });
        return { jobId, rejected: true, reason };
    }
};
exports.JobsDispatchService = JobsDispatchService;
exports.JobsDispatchService = JobsDispatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        trips_service_1.TripsService,
        realtime_gateway_1.RealtimeGateway])
], JobsDispatchService);
//# sourceMappingURL=jobs-dispatch.service.js.map