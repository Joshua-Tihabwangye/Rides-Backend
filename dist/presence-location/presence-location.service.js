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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceLocationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const driver_profile_service_1 = require("../driver-profile/driver-profile.service");
let PresenceLocationService = class PresenceLocationService {
    constructor(prisma, driverProfileService) {
        this.prisma = prisma;
        this.driverProfileService = driverProfileService;
    }
    async goOnline(driverId) {
        const checkpoints = await this.driverProfileService.getCheckpoints(driverId);
        const requiredKeys = [
            'roleSelected',
            'documentsVerified',
            'identityVerified',
            'vehicleReady',
            'emergencyContactReady',
            'trainingCompleted',
        ];
        const missing = requiredKeys.filter((key) => !checkpoints[key]);
        if (missing.length > 0) {
            throw new common_1.BadRequestException(`Onboarding incomplete: ${missing.join(', ')}`);
        }
        const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
        if (!profile) {
            throw new common_1.BadRequestException('Driver profile not found');
        }
        await this.prisma.driverProfile.update({
            where: { id: profile.id },
            data: { status: 'online', onboardingStatus: 'complete' },
        });
        return { status: 'online' };
    }
    async goOffline(driverId) {
        const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
        if (profile) {
            await this.prisma.driverProfile.update({
                where: { id: profile.id },
                data: { status: 'offline' },
            });
        }
        return { status: 'offline' };
    }
    async updateLocation(driverId, input) {
        const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
        if (!profile) {
            throw new common_1.BadRequestException('Driver profile not found');
        }
        await this.prisma.$queryRawUnsafe(`UPDATE driver_profiles SET current_location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3`, input.longitude, input.latitude, profile.id);
        return {
            driverId,
            latitude: input.latitude,
            longitude: input.longitude,
            accuracy: input.accuracy,
            timestamp: input.timestamp ?? Date.now(),
        };
    }
    async heartbeat(driverId, input) {
        const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
        if (!profile || profile.status !== 'online') {
            throw new common_1.BadRequestException('Driver must be online to send heartbeat');
        }
        return this.updateLocation(driverId, input);
    }
    async findNearbyDrivers(latitude, longitude, radiusMeters) {
        const rows = await this.prisma.$queryRawUnsafe(`
        SELECT
          dp.user_id AS "driverId",
          ST_Y(dp.current_location::geometry) AS latitude,
          ST_X(dp.current_location::geometry) AS longitude,
          ST_Distance(
            dp.current_location,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
          ) AS "distanceMeters"
        FROM driver_profiles dp
        WHERE dp.status = 'online'
          AND dp.current_location IS NOT NULL
          AND ST_DWithin(
            dp.current_location,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
            $3
          )
        ORDER BY "distanceMeters" ASC
      `, longitude, latitude, radiusMeters);
        return rows.map((row) => ({
            driverId: String(row.driverId),
            latitude: Number(row.latitude),
            longitude: Number(row.longitude),
            distanceMeters: Number(row.distanceMeters),
        }));
    }
};
exports.PresenceLocationService = PresenceLocationService;
exports.PresenceLocationService = PresenceLocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        driver_profile_service_1.DriverProfileService])
], PresenceLocationService);
//# sourceMappingURL=presence-location.service.js.map