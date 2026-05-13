import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
export declare class VehiclesService {
    private vehicleRepo;
    constructor(vehicleRepo: Repository<Vehicle>);
    list(driverId: string): Promise<Vehicle[]>;
    listFleet(fleetId: string): Promise<Vehicle[]>;
    createFleet(fleetId: string, input: {
        make: string;
        model: string;
        year: number;
        plate: string;
        type: string;
        status: string;
        accessories?: Record<string, any>;
    }): Promise<Vehicle>;
    create(driverId: string, input: {
        make: string;
        model: string;
        year: number;
        plate: string;
        type: string;
        status: string;
        accessories?: Record<string, any>;
    }): Promise<Vehicle>;
    findById(driverId: string, vehicleId: string): Promise<Vehicle>;
    findFleetVehicleById(fleetId: string, vehicleId: string): Promise<Vehicle>;
    update(driverId: string, vehicleId: string, patch: Partial<Vehicle>): Promise<Vehicle>;
    updateFleet(fleetId: string, vehicleId: string, patch: Partial<Vehicle>): Promise<Vehicle>;
    remove(driverId: string, vehicleId: string): Promise<{
        deleted: boolean;
    }>;
    patchAccessories(driverId: string, vehicleId: string, accessories: Record<string, any>): Promise<Vehicle>;
    uploadDocument(driverId: string, vehicleId: string, input: {
        documentType: string;
        fileUrl: string;
        expiryDate: string;
    }): Promise<any>;
}
