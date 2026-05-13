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
exports.RiderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const presence_location_service_1 = require("../presence-location/presence-location.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const rider_profile_entity_1 = require("../entities/rider-profile.entity");
const trip_entity_1 = require("../entities/trip.entity");
const job_offer_entity_1 = require("../entities/job-offer.entity");
const notification_entity_1 = require("../entities/notification.entity");
const user_entity_1 = require("../entities/user.entity");
let RiderService = class RiderService {
    constructor(riderProfileRepo, tripRepo, jobOfferRepo, notificationRepo, userRepo, presenceLocationService, realtimeGateway) {
        this.riderProfileRepo = riderProfileRepo;
        this.tripRepo = tripRepo;
        this.jobOfferRepo = jobOfferRepo;
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
        this.presenceLocationService = presenceLocationService;
        this.realtimeGateway = realtimeGateway;
    }
    async getProfile(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const profile = await this.riderProfileRepo.findOne({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Rider profile not found');
        }
        return profile;
    }
    async updateProfile(userId, patch) {
        const profile = await this.getProfile(userId);
        if (patch.fullName) {
            const [first, ...rest] = patch.fullName.split(' ');
            profile.firstName = first;
            profile.lastName = rest.join(' ');
        }
        if (patch.city)
            profile.city = patch.city;
        if (patch.country)
            profile.country = patch.country;
        if (patch.preferredCurrency)
            profile.preferredCurrency = patch.preferredCurrency;
        await this.riderProfileRepo.save(profile);
        return profile;
    }
    async listTrips(userId) {
        return this.tripRepo.find({
            where: { riderId: userId },
            order: { updatedAt: 'DESC' },
        });
    }
    async getActiveTrip(userId) {
        const activeTrip = await this.tripRepo.findOne({
            where: [
                { riderId: userId, status: 'requested' },
                { riderId: userId, status: 'driver_assigned' },
                { riderId: userId, status: 'driver_arriving' },
                { riderId: userId, status: 'arrived' },
                { riderId: userId, status: 'in_progress' },
            ],
        });
        return activeTrip ?? null;
    }
    async requestTrip(userId, input) {
        const trip = await this.createRequestedTrip(userId, input);
        const nearbyDrivers = (await this.presenceLocationService?.findNearbyDrivers(input.pickupLat, input.pickupLng, input.radiusMeters ?? 5000)) ?? [];
        const jobs = await Promise.all(nearbyDrivers.map(async (driver) => {
            const job = this.jobOfferRepo.create({
                driverId: driver.driverId,
                tripId: trip.id,
                status: 'pending',
                estimatedFare: 0,
            });
            await this.jobOfferRepo.save(job);
            const notification = this.notificationRepo.create({
                userId: driver.driverId,
                title: 'New trip request',
                body: `${input.pickupAddress} to ${input.dropoffAddress}`,
                type: 'info',
                isRead: false,
            });
            await this.notificationRepo.save(notification);
            this.realtimeGateway?.publishEvent({
                driverId: driver.driverId,
                event: 'job.offer.new',
                payload: {
                    jobId: job.id,
                    tripId: trip.id,
                    riderId: userId,
                    pickup: input.pickupAddress,
                    dropoff: input.dropoffAddress,
                    pickupLocation: { lat: input.pickupLat, lng: input.pickupLng },
                    dropoffLocation: { lat: input.dropoffLat, lng: input.dropoffLng },
                    distanceMeters: driver.distanceMeters,
                },
            });
            return {
                ...job,
                distanceMeters: driver.distanceMeters,
            };
        }));
        return {
            trip,
            jobOffers: jobs,
            nearbyDriverCount: jobs.length,
        };
    }
    async updateTripTracking(userId, tripId, patch) {
        const trip = await this.tripRepo.findOne({ where: { id: tripId, riderId: userId } });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        const nextStatus = this.mapTrackingStatus(patch.status);
        if (nextStatus) {
            trip.status = nextStatus;
            const now = new Date();
            if (nextStatus === 'arrived') {
                trip.driverArrivedAt = trip.driverArrivedAt ?? now;
            }
            if (nextStatus === 'in_progress') {
                trip.startedAt = trip.startedAt ?? now;
            }
            if (nextStatus === 'completed') {
                trip.completedAt = trip.completedAt ?? now;
            }
            if (nextStatus === 'cancelled') {
                trip.cancelledAt = trip.cancelledAt ?? now;
            }
        }
        await this.tripRepo.save(trip);
        return trip;
    }
    async createRequestedTrip(riderId, input) {
        const trip = this.tripRepo.create({
            riderId,
            type: input.type ?? 'ride',
            status: 'requested',
            pickupAddress: input.pickupAddress,
            dropoffAddress: input.dropoffAddress,
            pickupLocation: { lat: input.pickupLat, lng: input.pickupLng },
            dropoffLocation: { lat: input.dropoffLat, lng: input.dropoffLng },
            otpCode: String(Math.floor(1000 + Math.random() * 9000)),
        });
        await this.tripRepo.save(trip);
        return trip;
    }
    mapTrackingStatus(status) {
        switch (status) {
            case 'assigned':
                return 'driver_assigned';
            case 'driver_en_route':
                return 'driver_arriving';
            case 'arrived':
            case 'in_progress':
            case 'completed':
            case 'cancelled':
                return status;
            default:
                return null;
        }
    }
};
exports.RiderService = RiderService;
exports.RiderService = RiderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rider_profile_entity_1.RiderProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __param(2, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __param(3, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, common_1.Optional)()),
    __param(6, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        presence_location_service_1.PresenceLocationService,
        realtime_gateway_1.RealtimeGateway])
], RiderService);
//# sourceMappingURL=rider.service.js.map