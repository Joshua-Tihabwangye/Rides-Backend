import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(@InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>) {}

  async list(driverId: string) {
    return this.vehicleRepo.find({ where: { driverId } });
  }

  async listFleet(fleetId: string) {
    return this.vehicleRepo.find({ where: { fleetPartnerId: fleetId } });
  }

  async createFleet(
    fleetId: string,
    input: { make: string; model: string; year: number; plate: string; type: string; status: string; accessories?: Record<string, any> },
  ) {
    const created = this.vehicleRepo.create({
      fleetPartnerId: fleetId,
      driverId: null as any, // Not assigned to a driver yet, assuming nullable string but typeorm sometimes requires casting if strict
      make: input.make,
      model: input.model,
      year: input.year,
      licensePlate: input.plate,
      type: input.type,
      status: input.status,
      accessories: input.accessories ?? {},
    });
    return this.vehicleRepo.save(created);
  }

  async create(driverId: string, input: { make: string; model: string; year: number; plate: string; type: string; status: string; accessories?: Record<string, any> }) {
    const created = this.vehicleRepo.create({
      driverId,
      make: input.make,
      model: input.model,
      year: input.year,
      licensePlate: input.plate,
      type: input.type,
      status: input.status,
      accessories: input.accessories ?? {},
    });
    return this.vehicleRepo.save(created);
  }

  async findById(driverId: string, vehicleId: string) {
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, driverId } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async findFleetVehicleById(fleetId: string, vehicleId: string) {
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, fleetPartnerId: fleetId } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async update(driverId: string, vehicleId: string, patch: Partial<Vehicle>) {
    const vehicle = await this.findById(driverId, vehicleId);
    Object.assign(vehicle, patch);
    return this.vehicleRepo.save(vehicle);
  }

  async updateFleet(fleetId: string, vehicleId: string, patch: Partial<Vehicle>) {
    const vehicle = await this.findFleetVehicleById(fleetId, vehicleId);
    Object.assign(vehicle, patch);
    return this.vehicleRepo.save(vehicle);
  }

  async remove(driverId: string, vehicleId: string) {
    const vehicle = await this.findById(driverId, vehicleId);
    await this.vehicleRepo.remove(vehicle);
    return { deleted: true };
  }

  async patchAccessories(driverId: string, vehicleId: string, accessories: Record<string, any>) {
    const vehicle = await this.findById(driverId, vehicleId);
    vehicle.accessories = accessories;
    return this.vehicleRepo.save(vehicle);
  }

  async uploadDocument(
    driverId: string,
    vehicleId: string,
    input: { documentType: string; fileUrl: string; expiryDate: string },
  ) {
    const vehicle = await this.findById(driverId, vehicleId);
    const documents = vehicle.documents || {};
    
    documents[input.documentType] = {
      fileUrl: input.fileUrl,
      expiryDate: input.expiryDate,
      status: 'under_review',
      updatedAt: Date.now(),
    };
    
    vehicle.documents = documents;
    await this.vehicleRepo.save(vehicle);
    
    return documents[input.documentType];
  }
}
