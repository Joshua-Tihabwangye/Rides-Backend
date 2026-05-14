import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriverProfileService } from '../driver-profile/driver-profile.service';

export interface NearbyDriverRecord {
  driverId: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  accuracy?: number;
  timestamp?: number;
}

@Injectable()
export class PresenceLocationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly driverProfileService: DriverProfileService,
  ) {}

  async goOnline(driverId: string) {
    const checkpoints = await this.driverProfileService.getCheckpoints(driverId) as Record<string, any>;
    const requiredKeys = [
      'roleSelected',
      'documentsVerified',
      'identityVerified',
      'vehicleReady',
      'emergencyContactReady',
      'trainingCompleted',
    ] as const;

    const missing = requiredKeys.filter((key) => !checkpoints[key]);
    if (missing.length > 0) {
      throw new BadRequestException(`Onboarding incomplete: ${missing.join(', ')}`);
    }

    const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
    if (!profile) {
      throw new BadRequestException('Driver profile not found');
    }

    await this.prisma.driverProfile.update({
      where: { id: profile.id },
      data: { status: 'online', onboardingStatus: 'complete' },
    });

    return { status: 'online' };
  }

  async goOffline(driverId: string) {
    const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
    if (profile) {
      await this.prisma.driverProfile.update({
        where: { id: profile.id },
        data: { status: 'offline' },
      });
    }
    return { status: 'offline' };
  }

  async updateLocation(
    driverId: string,
    input: { latitude: number; longitude: number; accuracy?: number; timestamp?: number },
  ) {
    const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
    if (!profile) {
      throw new BadRequestException('Driver profile not found');
    }

    await this.prisma.$queryRawUnsafe(
      `UPDATE driver_profiles SET current_location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3`,
      input.longitude,
      input.latitude,
      profile.id,
    );

    return {
      driverId,
      latitude: input.latitude,
      longitude: input.longitude,
      accuracy: input.accuracy,
      timestamp: input.timestamp ?? Date.now(),
    };
  }

  async heartbeat(
    driverId: string,
    input: { latitude: number; longitude: number; accuracy?: number; timestamp?: number },
  ) {
    const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
    if (!profile || profile.status !== 'online') {
      throw new BadRequestException('Driver must be online to send heartbeat');
    }
    return this.updateLocation(driverId, input);
  }

  async findNearbyDrivers(latitude: number, longitude: number, radiusMeters: number): Promise<NearbyDriverRecord[]> {
    const rows = await this.prisma.$queryRawUnsafe<Array<any>>(
      `
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
      `,
      longitude,
      latitude,
      radiusMeters,
    );

    return rows.map((row: any) => ({
      driverId: String(row.driverId),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      distanceMeters: Number(row.distanceMeters),
    }));
  }
}
