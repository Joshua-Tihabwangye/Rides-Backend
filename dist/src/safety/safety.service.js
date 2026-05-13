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
exports.SafetyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const safety_event_entity_1 = require("../entities/safety-event.entity");
const emergency_contact_entity_1 = require("../entities/emergency-contact.entity");
const driver_profile_entity_1 = require("../entities/driver-profile.entity");
let SafetyService = class SafetyService {
    constructor(safetyEventRepo, emergencyContactRepo, driverProfileRepo) {
        this.safetyEventRepo = safetyEventRepo;
        this.emergencyContactRepo = emergencyContactRepo;
        this.driverProfileRepo = driverProfileRepo;
    }
    async requestTemporaryStop(driverId, tripId, note = '') {
        const event = this.safetyEventRepo.create({
            driverId,
            tripId,
            type: 'temporary_stop',
            payload: {
                status: 'stop_requested',
                note,
                requestedAt: new Date().toISOString(),
            },
        });
        return this.safetyEventRepo.save(event);
    }
    async respondTemporaryStop(driverId, tripId, decision) {
        const event = this.safetyEventRepo.create({
            driverId,
            tripId,
            type: 'temporary_stop',
            payload: {
                status: decision === 'confirm' ? 'temporarily_stopped' : 'idle',
                decision,
                respondedAt: new Date().toISOString(),
            },
        });
        return this.safetyEventRepo.save(event);
    }
    async resumeTemporaryStop(driverId, tripId) {
        const event = this.safetyEventRepo.create({
            driverId,
            tripId,
            type: 'temporary_stop',
            payload: {
                status: 'idle',
                resumedAt: new Date().toISOString(),
            },
        });
        return this.safetyEventRepo.save(event);
    }
    async respondSafetyCheck(driverId, tripId, actor, action) {
        const event = this.safetyEventRepo.create({
            driverId,
            tripId,
            type: 'safety_check',
            payload: {
                actor,
                action,
                respondedAt: new Date().toISOString(),
            },
        });
        return this.safetyEventRepo.save(event);
    }
    async triggerSos(driverId, tripId, payload) {
        const event = this.safetyEventRepo.create({
            driverId,
            tripId,
            type: 'sos',
            payload: {
                ...payload,
                triggeredAt: new Date().toISOString(),
            },
        });
        return this.safetyEventRepo.save(event);
    }
    async listEmergencyContacts(driverId) {
        return this.emergencyContactRepo.find({ where: { driverId } });
    }
    async createEmergencyContact(driverId, input) {
        const contact = this.emergencyContactRepo.create({
            driverId,
            name: input.name,
            phone: input.phone,
            relationship: input.relationship,
        });
        await this.emergencyContactRepo.save(contact);
        const profile = await this.driverProfileRepo.findOne({ where: { userId: driverId } });
        if (profile) {
            profile.checkpoints = {
                ...(profile.checkpoints || {}),
                emergencyContactReady: true,
            };
            await this.driverProfileRepo.save(profile);
        }
        return contact;
    }
    async patchEmergencyContact(driverId, contactId, patch) {
        const contact = await this.emergencyContactRepo.findOne({ where: { id: contactId, driverId } });
        if (!contact) {
            throw new common_1.NotFoundException('Emergency contact not found');
        }
        Object.assign(contact, patch);
        return this.emergencyContactRepo.save(contact);
    }
    async deleteEmergencyContact(driverId, contactId) {
        const result = await this.emergencyContactRepo.delete({ id: contactId, driverId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Emergency contact not found');
        }
        return { deleted: true };
    }
};
exports.SafetyService = SafetyService;
exports.SafetyService = SafetyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(safety_event_entity_1.SafetyEvent)),
    __param(1, (0, typeorm_1.InjectRepository)(emergency_contact_entity_1.EmergencyContact)),
    __param(2, (0, typeorm_1.InjectRepository)(driver_profile_entity_1.DriverProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SafetyService);
//# sourceMappingURL=safety.service.js.map