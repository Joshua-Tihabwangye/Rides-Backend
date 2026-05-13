import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverProfile } from '../entities/driver-profile.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class DriverProfileService {
  constructor(
    @InjectRepository(DriverProfile) private driverProfileRepo: Repository<DriverProfile>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getProfile(driverId: string) {
    const profile = await this.driverProfileRepo.findOne({ where: { userId: driverId } });
    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }
    return profile;
  }

  async updateProfile(driverId: string, patch: Partial<{ fullName: string; phone: string; city: string; country: string }>) {
    const profile = await this.getProfile(driverId);
    if (patch.fullName) {
      const [first, ...rest] = patch.fullName.split(' ');
      profile.firstName = first;
      profile.lastName = rest.join(' ');
    }
    if (patch.city) profile.city = patch.city;
    if (patch.country) profile.country = patch.country;

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

  async getPreferences(driverId: string) {
    const profile = await this.getProfile(driverId);
    return profile.preferences || {};
  }

  async updatePreferences(
    driverId: string,
    patch: Partial<{ areaIds: string[]; serviceIds: string[]; requirementIds: string[] }>,
  ) {
    const profile = await this.getProfile(driverId);
    profile.preferences = {
      ...(profile.preferences || {}),
      ...patch,
    };
    await this.driverProfileRepo.save(profile);
    return profile.preferences;
  }

  async getCheckpoints(driverId: string) {
    const profile = await this.getProfile(driverId);
    const checkpoints = profile.checkpoints || {};
    return {
      ...checkpoints,
      onboardingComplete: Object.keys(checkpoints).length > 0 && Object.values(checkpoints).every(Boolean),
    };
  }
}
