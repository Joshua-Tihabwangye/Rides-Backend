import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { JobOffer } from '../entities/job-offer.entity';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { TripsService } from '../trips/trips.service';

@Injectable()
export class JobsDispatchService {
  constructor(
    @InjectRepository(JobOffer) private jobRepo: Repository<JobOffer>,
    private readonly tripsService: TripsService,
    @Optional() private readonly realtimeGateway?: RealtimeGateway,
  ) {}

  async list(driverId: string, query: { status?: string; type?: string }) {
    const where: any = { driverId };
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    return this.jobRepo.find({ where });
  }

  async getActive(driverId: string) {
    return this.jobRepo.findOne({
      where: {
        driverId,
        status: In(['accepted', 'in_progress']),
      },
    });
  }

  async accept(driverId: string, jobId: string) {
    const job = await this.jobRepo.findOne({ where: { id: jobId, driverId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    if (!['offered', 'pending'].includes(job.status)) {
      throw new BadRequestException(`Job cannot be accepted from ${job.status} state`);
    }

    job.status = 'accepted';
    job.respondedAt = new Date();
    await this.jobRepo.save(job);

    const trip = await this.tripsService.startFromJob(driverId, job.id);
    await this.tripsService.markEnRoute(driverId, trip.id);

    // Cancel other offers for this trip
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

  async reject(driverId: string, jobId: string, reason = '') {
    const job = await this.jobRepo.findOne({ where: { id: jobId, driverId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    if (!['offered', 'pending'].includes(job.status)) {
      throw new BadRequestException(`Job cannot be rejected from ${job.status} state`);
    }

    job.status = 'rejected';
    job.respondedAt = new Date();
    // Assuming rejectionReason field exists or we add it to entity if needed. 
    // The entity I saw earlier had status, but let's check it.
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
}
