import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { TripsService } from '../trips/trips.service';

@Injectable()
export class JobsDispatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tripsService: TripsService,
    @Optional() private readonly realtimeGateway?: RealtimeGateway,
  ) {}

  async list(driverId: string, query: { status?: string; type?: string }) {
    const where: Record<string, unknown> = { driverId };
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    return this.prisma.jobOffer.findMany({ where });
  }

  async getActive(driverId: string) {
    return this.prisma.jobOffer.findFirst({
      where: {
        driverId,
        status: { in: ['accepted', 'in_progress' as any] },
      },
    });
  }

  async accept(driverId: string, jobId: string) {
    const job = await this.prisma.jobOffer.findFirst({ where: { id: jobId, driverId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    if (!['offered', 'pending'].includes(job.status)) {
      throw new BadRequestException(`Job cannot be accepted from ${job.status} state`);
    }

    const updatedJob = await this.prisma.jobOffer.update({
      where: { id: jobId },
      data: { status: 'accepted', respondedAt: new Date() },
    });

    const trip = await this.tripsService.startFromJob(driverId, job.id);
    await this.tripsService.markEnRoute(driverId, trip.id);

    // Cancel other offers for this trip
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

  async reject(driverId: string, jobId: string, reason = '') {
    const job = await this.prisma.jobOffer.findFirst({ where: { id: jobId, driverId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    if (!['offered', 'pending'].includes(job.status)) {
      throw new BadRequestException(`Job cannot be rejected from ${job.status} state`);
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
}
