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
exports.SafetyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let SafetyService = class SafetyService {
    constructor(prisma) {
        this.prisma = prisma;
        this.shareContactsStore = new Map();
        this.trainingModuleStore = new Map();
    }
    async requestTemporaryStop(driverId, tripId, note = '') {
        return this.prisma.safetyEvent.create({
            data: {
                driverId,
                tripId,
                type: 'temporary_stop',
                payload: {
                    status: 'stop_requested',
                    note,
                    requestedAt: new Date().toISOString(),
                },
            },
        });
    }
    async respondTemporaryStop(driverId, tripId, decision) {
        return this.prisma.safetyEvent.create({
            data: {
                driverId,
                tripId,
                type: 'temporary_stop',
                payload: {
                    status: decision === 'confirm' ? 'temporarily_stopped' : 'idle',
                    decision,
                    respondedAt: new Date().toISOString(),
                },
            },
        });
    }
    async resumeTemporaryStop(driverId, tripId) {
        return this.prisma.safetyEvent.create({
            data: {
                driverId,
                tripId,
                type: 'temporary_stop',
                payload: {
                    status: 'idle',
                    resumedAt: new Date().toISOString(),
                },
            },
        });
    }
    async respondSafetyCheck(driverId, tripId, actor, action) {
        return this.prisma.safetyEvent.create({
            data: {
                driverId,
                tripId,
                type: 'safety_check',
                payload: {
                    actor,
                    action,
                    respondedAt: new Date().toISOString(),
                },
            },
        });
    }
    async triggerSos(driverId, tripId, payload) {
        return this.prisma.safetyEvent.create({
            data: {
                driverId,
                tripId,
                type: 'sos',
                payload: {
                    ...payload,
                    triggeredAt: new Date().toISOString(),
                },
            },
        });
    }
    async getTripSafetyState(driverId, tripId) {
        const events = await this.prisma.safetyEvent.findMany({
            where: { driverId, tripId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        const temporaryStop = events.find((event) => event.type === 'temporary_stop');
        const safetyCheck = events.find((event) => event.type === 'safety_check');
        const sos = events.find((event) => event.type === 'sos');
        return {
            tripId,
            temporaryStop: {
                status: temporaryStop?.payload?.status ?? 'idle',
                requestNote: temporaryStop?.payload?.note,
            },
            safetyCheck: {
                status: sos ? 'sos_triggered' : (safetyCheck?.payload?.status ?? 'idle'),
                driverAction: safetyCheck?.payload?.actor === 'driver' ? safetyCheck?.payload?.action : null,
                passengerAction: safetyCheck?.payload?.actor === 'passenger' ? safetyCheck?.payload?.action : null,
            },
            lastEmergencyDispatch: sos
                ? {
                    id: sos.id,
                    tripId,
                    triggeredBy: (sos.payload?.triggeredBy ?? 'driver'),
                    triggeredAt: new Date(sos.createdAt).getTime(),
                    contactsNotified: sos.payload?.contactsNotified ?? [],
                    location: sos.payload?.latitude != null && sos.payload?.longitude != null
                        ? {
                            latitude: Number(sos.payload.latitude),
                            longitude: Number(sos.payload.longitude),
                            accuracy: sos.payload?.accuracy,
                            timestamp: sos.payload?.timestamp ? Number(sos.payload.timestamp) : new Date(sos.createdAt).getTime(),
                        }
                        : null,
                    helpMessage: sos.payload?.helpMessage,
                }
                : null,
            updatedAt: events[0] ? new Date(events[0].createdAt).getTime() : Date.now(),
        };
    }
    async saveTripSafetyState(driverId, tripId, state) {
        await this.prisma.safetyEvent.create({
            data: {
                driverId,
                tripId,
                type: 'safety_check',
                payload: {
                    status: 'resolved',
                    snapshot: state,
                    updatedAt: new Date().toISOString(),
                },
            },
        });
        return this.getTripSafetyState(driverId, tripId);
    }
    async listEmergencyContacts(driverId) {
        return this.prisma.emergencyContact.findMany({ where: { driverId } });
    }
    async createEmergencyContact(driverId, input) {
        const contact = await this.prisma.emergencyContact.create({
            data: {
                driverId,
                name: input.name,
                phone: input.phone,
                relationship: input.relationship,
            },
        });
        const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
        if (profile) {
            const checkpoints = profile.checkpoints || {};
            await this.prisma.driverProfile.update({
                where: { id: profile.id },
                data: {
                    checkpoints: { ...checkpoints, emergencyContactReady: true },
                },
            });
        }
        return contact;
    }
    async patchEmergencyContact(driverId, contactId, patch) {
        const contact = await this.prisma.emergencyContact.findFirst({ where: { id: contactId, driverId } });
        if (!contact) {
            throw new common_1.NotFoundException('Emergency contact not found');
        }
        return this.prisma.emergencyContact.update({ where: { id: contactId }, data: patch });
    }
    async deleteEmergencyContact(driverId, contactId) {
        const contact = await this.prisma.emergencyContact.findFirst({ where: { id: contactId, driverId } });
        if (!contact) {
            throw new common_1.NotFoundException('Emergency contact not found');
        }
        await this.prisma.emergencyContact.delete({ where: { id: contactId } });
        return { deleted: true };
    }
    async listTripShareContacts(driverId, tripId) {
        const key = `${driverId}:${tripId}`;
        return this.shareContactsStore.get(key) ?? [];
    }
    async addTripShareContact(driverId, tripId, input) {
        const key = `${driverId}:${tripId}`;
        const current = this.shareContactsStore.get(key) ?? [];
        const created = {
            id: (0, crypto_1.randomUUID)(),
            name: input.name,
            phone: input.phone,
            relationship: input.relationship,
            createdAt: Date.now(),
        };
        current.unshift(created);
        this.shareContactsStore.set(key, current.slice(0, 50));
        return created;
    }
    async deleteTripShareContact(driverId, tripId, contactId) {
        const key = `${driverId}:${tripId}`;
        const current = this.shareContactsStore.get(key) ?? [];
        const filtered = current.filter((item) => item.id !== contactId);
        if (filtered.length === current.length) {
            throw new common_1.NotFoundException('Share contact not found');
        }
        this.shareContactsStore.set(key, filtered);
        return { deleted: true };
    }
    async createTripShareLink(driverId, tripId) {
        const token = (0, crypto_1.randomUUID)().replace(/-/g, '');
        return {
            tripId,
            shareUrl: `https://evzone.app/follow/${tripId}?token=${token}`,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1000 * 60 * 60 * 24,
            driverId,
        };
    }
    async getTripShareStatus(driverId, tripId) {
        const contacts = await this.listTripShareContacts(driverId, tripId);
        return {
            tripId,
            contactsCount: contacts.length,
            sharingEnabled: contacts.length > 0,
            lastUpdatedAt: Date.now(),
        };
    }
    async listTrainingModules(driverId) {
        if (!this.trainingModuleStore.has(driverId)) {
            this.trainingModuleStore.set(driverId, [
                {
                    id: 'safety-basics',
                    title: 'Safety Basics',
                    description: 'Core trip safety and emergency procedures.',
                    status: 'published',
                    progress: 'not_started',
                },
                {
                    id: 'customer-care',
                    title: 'Customer Care',
                    description: 'Passenger communication and service quality.',
                    status: 'published',
                    progress: 'not_started',
                },
            ]);
        }
        return this.trainingModuleStore.get(driverId) ?? [];
    }
    async getTrainingModule(driverId, moduleId) {
        const modules = await this.listTrainingModules(driverId);
        const module = modules.find((item) => item.id === moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Training module not found');
        }
        return module;
    }
    async createTrainingAttempt(driverId, moduleId, input) {
        const module = await this.getTrainingModule(driverId, moduleId);
        const score = Number(input.answers ? Object.keys(input.answers).length * 10 : 80);
        Object.assign(module, { progress: 'attempted', lastAttemptScore: score, lastAttemptAt: Date.now() });
        return {
            moduleId,
            score,
            passed: score >= 60,
            attemptedAt: Date.now(),
        };
    }
    async completeTrainingModule(driverId, moduleId) {
        const module = await this.getTrainingModule(driverId, moduleId);
        Object.assign(module, { progress: 'completed', completedAt: Date.now() });
        return module;
    }
};
exports.SafetyService = SafetyService;
exports.SafetyService = SafetyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SafetyService);
//# sourceMappingURL=safety.service.js.map