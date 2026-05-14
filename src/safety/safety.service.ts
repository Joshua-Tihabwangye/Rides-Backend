import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class SafetyService {
  private readonly shareContactsStore = new Map<string, Array<Record<string, unknown>>>();
  private readonly trainingModuleStore = new Map<string, Array<Record<string, unknown>>>();

  constructor(private readonly prisma: PrismaService) {}

  async requestTemporaryStop(driverId: string, tripId: string, note = '') {
    return this.prisma.safetyEvent.create({
      data: {
        driverId,
        tripId,
        type: 'temporary_stop',
        payload: {
          status: 'stop_requested',
          note,
          requestedAt: new Date().toISOString(),
        } as any,
      },
    });
  }

  async respondTemporaryStop(driverId: string, tripId: string, decision: 'confirm' | 'decline') {
    return this.prisma.safetyEvent.create({
      data: {
        driverId,
        tripId,
        type: 'temporary_stop',
        payload: {
          status: decision === 'confirm' ? 'temporarily_stopped' : 'idle',
          decision,
          respondedAt: new Date().toISOString(),
        } as any,
      },
    });
  }

  async resumeTemporaryStop(driverId: string, tripId: string) {
    return this.prisma.safetyEvent.create({
      data: {
        driverId,
        tripId,
        type: 'temporary_stop',
        payload: {
          status: 'idle',
          resumedAt: new Date().toISOString(),
        } as any,
      },
    });
  }

  async respondSafetyCheck(driverId: string, tripId: string, actor: 'driver' | 'passenger', action: 'okay' | 'sos') {
    return this.prisma.safetyEvent.create({
      data: {
        driverId,
        tripId,
        type: 'safety_check',
        payload: {
          actor,
          action,
          respondedAt: new Date().toISOString(),
        } as any,
      },
    });
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
    return this.prisma.safetyEvent.create({
      data: {
        driverId,
        tripId,
        type: 'sos',
        payload: {
          ...payload,
          triggeredAt: new Date().toISOString(),
        } as any,
      },
    });
  }

  async getTripSafetyState(driverId: string, tripId: string) {
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
        status: (temporaryStop?.payload as any)?.status ?? 'idle',
        requestNote: (temporaryStop?.payload as any)?.note,
      },
      safetyCheck: {
        status: sos ? 'sos_triggered' : ((safetyCheck?.payload as any)?.status ?? 'idle'),
        driverAction: (safetyCheck?.payload as any)?.actor === 'driver' ? (safetyCheck?.payload as any)?.action : null,
        passengerAction: (safetyCheck?.payload as any)?.actor === 'passenger' ? (safetyCheck?.payload as any)?.action : null,
      },
      lastEmergencyDispatch: sos
        ? {
            id: sos.id,
            tripId,
            triggeredBy: ((sos.payload as any)?.triggeredBy ?? 'driver'),
            triggeredAt: new Date(sos.createdAt).getTime(),
            contactsNotified: (sos.payload as any)?.contactsNotified ?? [],
            location:
              (sos.payload as any)?.latitude != null && (sos.payload as any)?.longitude != null
                ? {
                    latitude: Number((sos.payload as any).latitude),
                    longitude: Number((sos.payload as any).longitude),
                    accuracy: (sos.payload as any)?.accuracy,
                    timestamp: (sos.payload as any)?.timestamp ? Number((sos.payload as any).timestamp) : new Date(sos.createdAt).getTime(),
                  }
                : null,
            helpMessage: (sos.payload as any)?.helpMessage,
          }
        : null,
      updatedAt: events[0] ? new Date(events[0].createdAt).getTime() : Date.now(),
    };
  }

  async saveTripSafetyState(driverId: string, tripId: string, state: Record<string, unknown>) {
    await this.prisma.safetyEvent.create({
      data: {
        driverId,
        tripId,
        type: 'safety_check',
        payload: {
          status: 'resolved',
          snapshot: state,
          updatedAt: new Date().toISOString(),
        } as any,
      },
    });
    return this.getTripSafetyState(driverId, tripId);
  }

  async listEmergencyContacts(driverId: string) {
    return this.prisma.emergencyContact.findMany({ where: { driverId } });
  }

  async createEmergencyContact(driverId: string, input: { name: string; phone: string; relationship?: string }) {
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
      const checkpoints = (profile.checkpoints as Record<string, any>) || {};
      await this.prisma.driverProfile.update({
        where: { id: profile.id },
        data: {
          checkpoints: { ...checkpoints, emergencyContactReady: true },
        },
      });
    }

    return contact;
  }

  async patchEmergencyContact(
    driverId: string,
    contactId: string,
    patch: Partial<{ name: string; phone: string; relationship?: string }>,
  ) {
    const contact = await this.prisma.emergencyContact.findFirst({ where: { id: contactId, driverId } });
    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }
    return this.prisma.emergencyContact.update({ where: { id: contactId }, data: patch });
  }

  async deleteEmergencyContact(driverId: string, contactId: string) {
    const contact = await this.prisma.emergencyContact.findFirst({ where: { id: contactId, driverId } });
    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }
    await this.prisma.emergencyContact.delete({ where: { id: contactId } });
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
