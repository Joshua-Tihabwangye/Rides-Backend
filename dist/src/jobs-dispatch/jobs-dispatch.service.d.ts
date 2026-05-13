import { Repository } from 'typeorm';
import { JobOffer } from '../entities/job-offer.entity';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { TripsService } from '../trips/trips.service';
export declare class JobsDispatchService {
    private jobRepo;
    private readonly tripsService;
    private readonly realtimeGateway?;
    constructor(jobRepo: Repository<JobOffer>, tripsService: TripsService, realtimeGateway?: RealtimeGateway | undefined);
    list(driverId: string, query: {
        status?: string;
        type?: string;
    }): Promise<JobOffer[]>;
    getActive(driverId: string): Promise<JobOffer | null>;
    accept(driverId: string, jobId: string): Promise<{
        job: JobOffer;
        trip: import("../entities/trip.entity").Trip;
    }>;
    reject(driverId: string, jobId: string, reason?: string): Promise<{
        jobId: string;
        rejected: boolean;
        reason: string;
    }>;
}
