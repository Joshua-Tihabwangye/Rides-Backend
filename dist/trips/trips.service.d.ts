import { Repository } from 'typeorm';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { RiderRealtimeGateway } from '../realtime/scoped-realtime.gateway';
import { Trip } from '../entities/trip.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { WalletAccount } from '../entities/wallet-account.entity';
export declare class TripsService {
    private tripRepo;
    private jobOfferRepo;
    private earningsLedgerRepo;
    private walletRepo;
    private readonly realtimeGateway?;
    private readonly riderRealtimeGateway?;
    constructor(tripRepo: Repository<Trip>, jobOfferRepo: Repository<JobOffer>, earningsLedgerRepo: Repository<EarningsLedger>, walletRepo: Repository<WalletAccount>, realtimeGateway?: RealtimeGateway | undefined, riderRealtimeGateway?: RiderRealtimeGateway | undefined);
    getActive(driverId: string): Promise<Trip | null>;
    list(driverId: string, query: {
        type?: string;
        status?: string;
        cursor?: string;
    }): Promise<{
        items: Trip[];
        nextCursor: string | null;
    }>;
    startFromJob(driverId: string, jobId: string): Promise<Trip>;
    arrive(driverId: string, tripId: string): Promise<Trip>;
    verifyRider(driverId: string, tripId: string, otp: string): Promise<Trip>;
    start(driverId: string, tripId: string): Promise<Trip>;
    complete(driverId: string, tripId: string): Promise<Trip>;
    cancel(driverId: string, tripId: string, reason: string, details?: string, cancelledBy?: string): Promise<Trip>;
    assignDriver(driverId: string, tripId: string, jobId: string): Promise<Trip>;
    markEnRoute(driverId: string, tripId: string): Promise<Trip>;
    private getJobForDriver;
    private publishTripEvent;
    private transition;
    private ensureDriverMatch;
    getByIdOrPending(driverId: string, tripId: string): Promise<Trip>;
    getById(driverId: string, tripId: string): Promise<Trip>;
    hydrateTripFromJob(job: JobOffer): Promise<Trip>;
}
