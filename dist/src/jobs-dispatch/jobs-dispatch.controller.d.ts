import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JobsQueryDto, RejectJobDto } from './dto/jobs.dto';
import { JobsDispatchService } from './jobs-dispatch.service';
export declare class JobsDispatchController {
    private readonly jobsDispatchService;
    private readonly apiResponse;
    constructor(jobsDispatchService: JobsDispatchService, apiResponse: ApiResponseService);
    list(user: AuthenticatedUser, query: JobsQueryDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/job-offer.entity").JobOffer[]>>;
    getActive(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/job-offer.entity").JobOffer | null>>;
    accept(user: AuthenticatedUser, jobId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        job: import("../entities/job-offer.entity").JobOffer;
        trip: import("../entities/trip.entity").Trip;
    }>>;
    reject(user: AuthenticatedUser, jobId: string, body: RejectJobDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        jobId: string;
        rejected: boolean;
        reason: string;
    }>>;
}
