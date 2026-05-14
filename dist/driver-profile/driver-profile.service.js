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
exports.DriverProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DriverProfileService = class DriverProfileService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(driverId) {
        const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
        if (!profile) {
            throw new common_1.NotFoundException('Driver profile not found');
        }
        return profile;
    }
    async updateProfile(driverId, patch) {
        const profile = await this.getProfile(driverId);
        const data = {};
        if (patch.fullName) {
            const [first, ...rest] = patch.fullName.split(' ');
            data.firstName = first;
            data.lastName = rest.join(' ');
            data.fullName = patch.fullName;
        }
        if (patch.city)
            data.city = patch.city;
        if (patch.country)
            data.country = patch.country;
        await this.prisma.driverProfile.update({ where: { id: profile.id }, data });
        if (patch.phone) {
            await this.prisma.user.update({
                where: { id: profile.userId },
                data: { phone: patch.phone },
            });
        }
        return this.getProfile(driverId);
    }
    async getPreferences(driverId) {
        const profile = await this.getProfile(driverId);
        return profile.preferences || {};
    }
    async updatePreferences(driverId, patch) {
        const profile = await this.getProfile(driverId);
        const current = profile.preferences || {};
        await this.prisma.driverProfile.update({
            where: { id: profile.id },
            data: { preferences: { ...current, ...patch } },
        });
        return { ...current, ...patch };
    }
    async getCheckpoints(driverId) {
        const profile = await this.getProfile(driverId);
        const checkpoints = profile.checkpoints || {};
        return {
            ...checkpoints,
            onboardingComplete: Object.keys(checkpoints).length > 0 && Object.values(checkpoints).every(Boolean),
        };
    }
};
exports.DriverProfileService = DriverProfileService;
exports.DriverProfileService = DriverProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DriverProfileService);
//# sourceMappingURL=driver-profile.service.js.map