import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(driverId: string) {
    return this.prisma.vehicle.findMany({ where: { driverId } });
  }

  async listFleet(fleetId: string) {
    return this.prisma.vehicle.findMany({ where: { fleetPartnerId: fleetId } });
  }

  async createFleet(
    fleetId: string,
    input: { make: string; model: string; year: number; plate: string; type: string; status: string; accessories?: Record<string, any> },
  ) {
    return this.prisma.vehicle.create({
      data: {
        fleetPartnerId: fleetId,
        driverId: '',
        make: input.make,
        model: input.model,
        year: input.year,
        licensePlate: input.plate,
        type: input.type as any,
        status: input.status as any,
        accessories: input.accessories ?? {},
      },
    });
  }

  async create(driverId: string, input: { make: string; model: string; year: number; plate: string; type: string; status: string; accessories?: Record<string, any> }) {
    return this.prisma.vehicle.create({
      data: {
        driverId,
        make: input.make,
        model: input.model,
        year: input.year,
        licensePlate: input.plate,
        type: input.type as any,
        status: input.status as any,
        accessories: input.accessories ?? {},
      },
    });
  }

  async findById(driverId: string, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, driverId } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async findFleetVehicleById(fleetId: string, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetPartnerId: fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async update(driverId: string, vehicleId: string, patch: Record<string, any>) {
    await this.findById(driverId, vehicleId);
    return this.prisma.vehicle.update({ where: { id: vehicleId }, data: patch });
  }

  async updateFleet(fleetId: string, vehicleId: string, patch: Record<string, any>) {
    await this.findFleetVehicleById(fleetId, vehicleId);
    return this.prisma.vehicle.update({ where: { id: vehicleId }, data: patch });
  }

  async remove(driverId: string, vehicleId: string) {
    await this.findById(driverId, vehicleId);
    await this.prisma.vehicle.delete({ where: { id: vehicleId } });
    return { deleted: true };
  }

  async removeFleet(fleetId: string, vehicleId: string) {
    await this.findFleetVehicleById(fleetId, vehicleId);
    await this.prisma.vehicle.delete({ where: { id: vehicleId } });
    return { deleted: true };
  }

  async patchAccessories(driverId: string, vehicleId: string, accessories: Record<string, any>) {
    await this.findById(driverId, vehicleId);
    return this.prisma.vehicle.update({ where: { id: vehicleId }, data: { accessories } });
  }

  async uploadDocument(
    driverId: string,
    vehicleId: string,
    input: { documentType: string; fileUrl: string; expiryDate: string },
  ) {
    const vehicle = await this.findById(driverId, vehicleId);
    const documents = (vehicle.documents as Record<string, any>) || {};

    documents[input.documentType] = {
      fileUrl: input.fileUrl,
      expiryDate: input.expiryDate,
      status: 'under_review',
      updatedAt: Date.now(),
    };

    await this.prisma.vehicle.update({ where: { id: vehicleId }, data: { documents } });

    return documents[input.documentType];
  }
}
