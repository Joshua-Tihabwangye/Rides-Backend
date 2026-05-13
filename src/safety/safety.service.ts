import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { SafetyEvent } from '../entities/safety-event.entity';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { DriverProfile } from '../entities/driver-profile.entity';

@Injectable()
export class SafetyService {
  private readonly shareContactsStore = new Map<string, Array<Record<string, unknown>>>();
  private readonly trainingModuleStore = new Map<string, Array<Record<string, unknown>>>();

  constructor(
    @InjectRepository(SafetyEvent) private safetyEventRepo: Repository<SafetyEvent>,
    @InjectRepository(EmergencyContact) private emergencyContactRepo: Repository<EmergencyContact>,
    @InjectRepository(DriverProfile) private driverProfileRepo: Repository<DriverProfile>,
  ) {}

  async requestTemporaryStop(driverId: string, tripId: string, note = '') {
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

  async respondTemporaryStop(driverId: string, tripId: string, decision: 'confirm' | 'decline') {
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

  async resumeTemporaryStop(driverId: string, tripId: string) {
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

  async respondSafetyCheck(driverId: string, tripId: string, actor: 'driver' | 'passenger', action: 'okay' | 'sos') {
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

  async triggerSos(
    driverId: string,
    tripId: string,
    payload: {
      contactsNotified?: string[];
      latitude?: number;
      longitude?: number;
      helpMessage?: string;
    },
  ) {
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

  async getTripSafetyState(driverId: string, tripId: string) {
    const events = await this.safetyEventRepo.find({
      where: { driverId, tripId },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const temporaryStop = events.find((event) => event.type === 'temporary_stop');
    const safetyCheck = events.find((event) => event.type === 'safety_check');
    const sos = events.find((event) => event.type === 'sos');

    return {
      tripId,
      temporaryStop: {
        status: (temporaryStop?.payload?.status as 'idle' | 'stop_requested' | 'temporarily_stopped') ?? 'idle',
        requestNote: temporaryStop?.payload?.note as string | undefined,
      },
      safetyCheck: {
        status: sos ? 'sos_triggered' : ((safetyCheck?.payload?.status as 'idle' | 'safety_check_pending' | 'resolved') ?? 'idle'),
        driverAction: safetyCheck?.payload?.actor === 'driver' ? (safetyCheck?.payload?.action as 'okay' | 'sos') : null,
        passengerAction: safetyCheck?.payload?.actor === 'passenger' ? (safetyCheck?.payload?.action as 'okay' | 'sos') : null,
      },
      lastEmergencyDispatch: sos
        ? {
            id: sos.id,
            tripId,
            triggeredBy: ((sos.payload?.triggeredBy as 'driver' | 'passenger') ?? 'driver'),
            triggeredAt: new Date(sos.createdAt).getTime(),
            contactsNotified: (sos.payload?.contactsNotified as string[] | undefined) ?? [],
            location:
              sos.payload?.latitude != null && sos.payload?.longitude != null
                ? {
                    latitude: Number(sos.payload.latitude),
                    longitude: Number(sos.payload.longitude),
                    accuracy: sos.payload?.accuracy as number | undefined,
                    timestamp: sos.payload?.timestamp ? Number(sos.payload.timestamp) : new Date(sos.createdAt).getTime(),
                  }
                : null,
            helpMessage: sos.payload?.helpMessage as string | undefined,
          }
        : null,
      updatedAt: events[0] ? new Date(events[0].createdAt).getTime() : Date.now(),
    };
  }

  async saveTripSafetyState(driverId: string, tripId: string, state: Record<string, unknown>) {
    const event = this.safetyEventRepo.create({
      driverId,
      tripId,
      type: 'safety_check',
      payload: {
        status: 'resolved',
        snapshot: state,
        updatedAt: new Date().toISOString(),
      },
    });
    await this.safetyEventRepo.save(event);
    return this.getTripSafetyState(driverId, tripId);
  }

  async listEmergencyContacts(driverId: string) {
    return this.emergencyContactRepo.find({ where: { driverId } });
  }

  async createEmergencyContact(driverId: string, input: { name: string; phone: string; relationship?: string }) {
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

  async patchEmergencyContact(
    driverId: string,
    contactId: string,
    patch: Partial<{ name: string; phone: string; relationship?: string }>,
  ) {
    const contact = await this.emergencyContactRepo.findOne({ where: { id: contactId, driverId } });
    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }
    Object.assign(contact, patch);
    return this.emergencyContactRepo.save(contact);
  }

  async deleteEmergencyContact(driverId: string, contactId: string) {
    const result = await this.emergencyContactRepo.delete({ id: contactId, driverId });
    if (result.affected === 0) {
      throw new NotFoundException('Emergency contact not found');
    }
    return { deleted: true };
  }

  async listTripShareContacts(driverId: string, tripId: string) {
    const key = `${driverId}:${tripId}`;
    return this.shareContactsStore.get(key) ?? [];
  }

  async addTripShareContact(
    driverId: string,
    tripId: string,
    input: { name: string; phone: string; relationship?: string },
  ) {
    const key = `${driverId}:${tripId}`;
    const current = this.shareContactsStore.get(key) ?? [];
    const created = {
      id: randomUUID(),
      name: input.name,
      phone: input.phone,
      relationship: input.relationship,
      createdAt: Date.now(),
    };
    current.unshift(created);
    this.shareContactsStore.set(key, current.slice(0, 50));
    return created;
  }

  async deleteTripShareContact(driverId: string, tripId: string, contactId: string) {
    const key = `${driverId}:${tripId}`;
    const current = this.shareContactsStore.get(key) ?? [];
    const filtered = current.filter((item) => item.id !== contactId);
    if (filtered.length === current.length) {
      throw new NotFoundException('Share contact not found');
    }
    this.shareContactsStore.set(key, filtered);
    return { deleted: true };
  }

  async createTripShareLink(driverId: string, tripId: string) {
    const token = randomUUID().replace(/-/g, '');
    return {
      tripId,
      shareUrl: `https://evzone.app/follow/${tripId}?token=${token}`,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
      driverId,
    };
  }

  async getTripShareStatus(driverId: string, tripId: string) {
    const contacts = await this.listTripShareContacts(driverId, tripId);
    return {
      tripId,
      contactsCount: contacts.length,
      sharingEnabled: contacts.length > 0,
      lastUpdatedAt: Date.now(),
    };
  }

  async listTrainingModules(driverId: string) {
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

  async getTrainingModule(driverId: string, moduleId: string) {
    const modules = await this.listTrainingModules(driverId);
    const module = modules.find((item) => item.id === moduleId);
    if (!module) {
      throw new NotFoundException('Training module not found');
    }
    return module;
  }

  async createTrainingAttempt(driverId: string, moduleId: string, input: { answers?: Record<string, unknown> }) {
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

  async completeTrainingModule(driverId: string, moduleId: string) {
    const module = await this.getTrainingModule(driverId, moduleId);
    Object.assign(module, { progress: 'completed', completedAt: Date.now() });
    return module;
  }
}
