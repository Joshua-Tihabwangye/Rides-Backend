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
exports.DriverProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const driver_profile_entity_1 = require("../entities/driver-profile.entity");
const user_entity_1 = require("../entities/user.entity");
let DriverProfileService = class DriverProfileService {
    constructor(driverProfileRepo, userRepo) {
        this.driverProfileRepo = driverProfileRepo;
        this.userRepo = userRepo;
    }
    async getProfile(driverId) {
        const profile = await this.driverProfileRepo.findOne({ where: { userId: driverId } });
        if (!profile) {
            throw new common_1.NotFoundException('Driver profile not found');
        }
        return profile;
    }
    async updateProfile(driverId, patch) {
        const profile = await this.getProfile(driverId);
        if (patch.fullName) {
            const [first, ...rest] = patch.fullName.split(' ');
            profile.firstName = first;
            profile.lastName = rest.join(' ');
        }
        if (patch.city)
            profile.city = patch.city;
        if (patch.country)
            profile.country = patch.country;
        await this.driverProfileRepo.save(profile);
        if (patch.phone) {
            const user = await this.userRepo.findOne({ where: { id: profile.userId } });
            if (user) {
                user.phone = patch.phone;
                await this.userRepo.save(user);
            }
        }
        return profile;
    }
    async getPreferences(driverId) {
        const profile = await this.getProfile(driverId);
        return profile.preferences || {};
    }
    async updatePreferences(driverId, patch) {
        const profile = await this.getProfile(driverId);
        profile.preferences = {
            ...(profile.preferences || {}),
            ...patch,
        };
        await this.driverProfileRepo.save(profile);
        return profile.preferences;
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
    __param(0, (0, typeorm_1.InjectRepository)(driver_profile_entity_1.DriverProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DriverProfileService);
//# sourceMappingURL=driver-profile.service.js.map