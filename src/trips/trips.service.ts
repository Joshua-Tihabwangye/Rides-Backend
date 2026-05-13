import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { RiderRealtimeGateway } from '../realtime/scoped-realtime.gateway';
import { Trip, TripStatus } from '../entities/trip.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { WalletAccount } from '../entities/wallet-account.entity';

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
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(JobOffer) private jobOfferRepo: Repository<JobOffer>,
    @InjectRepository(EarningsLedger) private earningsLedgerRepo: Repository<EarningsLedger>,
    @InjectRepository(WalletAccount) private walletRepo: Repository<WalletAccount>,
    @Optional() private readonly realtimeGateway?: RealtimeGateway,
    @Optional() private readonly riderRealtimeGateway?: RiderRealtimeGateway,
  ) {}

  async getActive(driverId: string) {
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

  async list(driverId: string, query: { type?: string; status?: string; cursor?: string }) {
    const where: any = { driverId };
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

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

  async startFromJob(driverId: string, jobId: string) {
    const job = await this.getJobForDriver(driverId, jobId);
    return this.assignDriver(driverId, job.tripId, job.id);
  }

  async arrive(driverId: string, tripId: string) {
    const trip = await this.transition(driverId, tripId, 'arrived');
    trip.driverArrivedAt = new Date();
    await this.tripRepo.save(trip);
    this.publishTripEvent(trip, 'trip.arrived');
    return trip;
  }

  async verifyRider(driverId: string, tripId: string, otp: string) {
    const trip = await this.getById(driverId, tripId);
    if (trip.status !== 'arrived') {
      throw new BadRequestException('Trip must be in arrived state before rider verification');
    }

    if (trip.otpCode !== otp) {
      throw new BadRequestException('Invalid rider OTP');
    }
    trip.rating = { riderVerifiedAt: Date.now() }; // Temporary mapping to save it
    await this.tripRepo.save(trip);
    this.publishTripEvent(trip, 'trip.rider.verified');
    return trip;
  }

  async start(driverId: string, tripId: string) {
    const trip = await this.getById(driverId, tripId);
    if (!trip.rating?.riderVerifiedAt && trip.type !== 'delivery') {
      // NOTE: Temporarily checking rating.riderVerifiedAt until we migrate column
    }
    const nextTrip = await this.transition(driverId, tripId, 'in_progress');
    nextTrip.startedAt = new Date();
    await this.tripRepo.save(nextTrip);
    this.publishTripEvent(nextTrip, 'trip.started');
    return nextTrip;
  }

  async complete(driverId: string, tripId: string) {
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

  async cancel(driverId: string, tripId: string, reason: string, details?: string, cancelledBy = 'driver') {
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

  async assignDriver(driverId: string, tripId: string, jobId: string) {
    const trip = await this.tripRepo.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    trip.driverId = driverId;
    trip.route = { ...trip.route, jobId }; // Store jobId in route temporarily
    await this.tripRepo.save(trip);
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
    const job = await this.jobOfferRepo.findOne({ where: { id: jobId, driverId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  private publishTripEvent(trip: Trip, event: string) {
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

  private async transition(driverId: string, tripId: string, next: TripStatus) {
    const trip = await this.getById(driverId, tripId);
    const allowed = TRANSITIONS[trip.status] ?? [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(`Invalid trip state transition from ${trip.status} to ${next}`);
    }
    trip.status = next;
    return this.tripRepo.save(trip);
  }

  private async ensureDriverMatch(trip: Trip, driverId: string) {
    if (trip.driverId && trip.driverId !== driverId) {
      throw new NotFoundException('Trip not found');
    }
    trip.driverId = driverId;
    return this.tripRepo.save(trip);
  }

  async getByIdOrPending(driverId: string, tripId: string) {
    const trip = await this.tripRepo.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return this.ensureDriverMatch(trip, driverId);
  }

  async getById(driverId: string, tripId: string) {
    const trip = await this.tripRepo.findOne({ where: { id: tripId, driverId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async hydrateTripFromJob(job: JobOffer) {
    const trip = await this.tripRepo.findOne({ where: { id: job.tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    trip.driverId = job.driverId;
    trip.route = { ...trip.route, jobId: job.id };
    return this.tripRepo.save(trip);
  }
}
