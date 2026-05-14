import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriverProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(driverId: string) {
    const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }
    return profile;
  }

  async updateProfile(driverId: string, patch: Partial<{ fullName: string; phone: string; city: string; country: string }>) {
    const profile = await this.getProfile(driverId);
    const data: Record<string, unknown> = {};
    if (patch.fullName) {
      const [first, ...rest] = patch.fullName.split(' ');
      data.firstName = first;
      data.lastName = rest.join(' ');
      data.fullName = patch.fullName;
    }
    if (patch.city) data.city = patch.city;
    if (patch.country) data.country = patch.country;

    await this.prisma.driverProfile.update({ where: { id: profile.id }, data });

    if (patch.phone) {
      await this.prisma.user.update({
        where: { id: profile.userId },
        data: { phone: patch.phone },
      });
    }
    return this.getProfile(driverId);
  }

  async getPreferences(driverId: string) {
    const profile = await this.getProfile(driverId);
    return (profile.preferences as Record<string, unknown>) || {};
  }

  async updatePreferences(
    driverId: string,
    patch: Partial<{ areaIds: string[]; serviceIds: string[]; requirementIds: string[] }>,
  ) {
    const profile = await this.getProfile(driverId);
    const current = (profile.preferences as Record<string, unknown>) || {};
    await this.prisma.driverProfile.update({
      where: { id: profile.id },
      data: { preferences: { ...current, ...patch } },
    });
    return { ...current, ...patch };
  }

  async getCheckpoints(driverId: string) {
    const profile = await this.getProfile(driverId);
    const checkpoints = (profile.checkpoints as Record<string, any>) || {};
    return {
      ...checkpoints,
      onboardingComplete: Object.keys(checkpoints).length > 0 && Object.values(checkpoints).every(Boolean),
    };
  }
}
