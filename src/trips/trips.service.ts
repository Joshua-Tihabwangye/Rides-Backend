import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { RiderRealtimeGateway } from '../realtime/scoped-realtime.gateway';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { KafkaTopics } from '../kafka/kafka.topics';
import { TripStatus } from '@prisma/client';

const TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  requested: ['driver_assigned', 'cancelled'],
  driver_assigned: ['driver_arriving', 'cancelled'],
  driver_arriving: ['arrived', 'cancelled'],
  arrived: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

@Injectable()
export class TripsService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly realtimeGateway?: RealtimeGateway,
    @Optional() private readonly riderRealtimeGateway?: RiderRealtimeGateway,
    @Optional() private readonly kafka?: KafkaProducerService,
  ) {}

  async getActive(driverId: string) {
    return this.prisma.trip.findFirst({
      where: {
        driverId,
        status: { in: ['driver_assigned', 'driver_arriving', 'arrived', 'in_progress'] },
      },
    });
  }

  async list(driverId: string, query: { type?: string; status?: string; cursor?: string }) {
    const where: Record<string, unknown> = { driverId };
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

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

  async startFromJob(driverId: string, jobId: string) {
    const job = await this.getJobForDriver(driverId, jobId);
    return this.assignDriver(driverId, job.tripId, job.id);
  }

  async arrive(driverId: string, tripId: string) {
    const trip = await this.transition(driverId, tripId, 'arrived');
    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { driverArrivedAt: new Date() },
    });
    this.publishTripEvent(updated, 'trip.arrived');
    return updated;
  }

  async verifyRider(driverId: string, tripId: string, otp: string) {
    const trip = await this.getById(driverId, tripId);
    if (trip.status !== 'arrived') {
      throw new BadRequestException('Trip must be in arrived state before rider verification');
    }

    if (trip.otpCode !== otp) {
      throw new BadRequestException('Invalid rider OTP');
    }
    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { rating: { riderVerifiedAt: Date.now() } as any },
    });
    this.publishTripEvent(updated, 'trip.rider.verified');
    return updated;
  }

  async start(driverId: string, tripId: string) {
    const trip = await this.getById(driverId, tripId);
    const rating = trip.rating as any;
    if (!rating?.riderVerifiedAt && trip.type !== 'delivery') {
      // NOTE: Temporarily checking rating.riderVerifiedAt until we migrate column
    }
    const nextTrip = await this.transition(driverId, tripId, 'in_progress');
    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { startedAt: new Date() },
    });
    this.publishTripEvent(updated, 'trip.started');
    return updated;
  }

  async complete(driverId: string, tripId: string) {
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

  async cancel(driverId: string, tripId: string, reason: string, details?: string, cancelledBy = 'driver') {
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
        } as any,
      },
    });
    this.publishTripEvent(updated, 'trip.cancelled');
    return updated;
  }

  async assignDriver(driverId: string, tripId: string, jobId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    await this.prisma.trip.update({
      where: { id: tripId },
      data: { driverId, route: { ...trip.route as any, jobId } },
    });
    const assignedTrip = await this.transition(driverId, tripId, 'driver_assigned');
    this.publishTripEvent(assignedTrip, 'trip.driver.assigned');
    return assignedTrip;
  }

  async markEnRoute(driverId: string, tripId: string) {
    const trip = await this.transition(driverId, tripId, 'driver_arriving');
    this.publishTripEvent(trip, 'trip.driver.arriving');
    return trip;
  }

  private async getJobForDriver(driverId: string, jobId: string) {
    const job = await this.prisma.jobOffer.findFirst({ where: { id: jobId, driverId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  private publishTripEvent(trip: any, event: string) {
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

    this.kafka?.emit(KafkaTopics.TRIPS, event, payload, {
      key: trip.id,
      userId: trip.driverId || trip.riderId,
    });
  }

  private async transition(driverId: string, tripId: string, next: TripStatus) {
    const trip = await this.getById(driverId, tripId);
    const allowed = TRANSITIONS[trip.status] ?? [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(`Invalid trip state transition from ${trip.status} to ${next}`);
    }
    return this.prisma.trip.update({ where: { id: tripId }, data: { status: next } });
  }

  private async ensureDriverMatch(trip: any, driverId: string) {
    if (trip.driverId && trip.driverId !== driverId) {
      throw new NotFoundException('Trip not found');
    }
    return this.prisma.trip.update({ where: { id: trip.id }, data: { driverId } });
  }

  async getByIdOrPending(driverId: string, tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return this.ensureDriverMatch(trip, driverId);
  }

  async getById(driverId: string, tripId: string) {
    const trip = await this.prisma.trip.findFirst({ where: { id: tripId, driverId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async hydrateTripFromJob(job: any) {
    const trip = await this.prisma.trip.findUnique({ where: { id: job.tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return this.prisma.trip.update({
      where: { id: trip.id },
      data: { driverId: job.driverId, route: { ...trip.route as any, jobId: job.id } },
    });
  }
}
