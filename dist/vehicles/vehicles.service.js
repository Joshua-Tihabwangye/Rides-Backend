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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("../entities/vehicle.entity");
let VehiclesService = class VehiclesService {
    constructor(vehicleRepo) {
        this.vehicleRepo = vehicleRepo;
    }
    async list(driverId) {
        return this.vehicleRepo.find({ where: { driverId } });
    }
    async listFleet(fleetId) {
        return this.vehicleRepo.find({ where: { fleetPartnerId: fleetId } });
    }
    async createFleet(fleetId, input) {
        const created = this.vehicleRepo.create({
            fleetPartnerId: fleetId,
            driverId: null,
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
    async create(driverId, input) {
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
    async findById(driverId, vehicleId) {
        const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, driverId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return vehicle;
    }
    async findFleetVehicleById(fleetId, vehicleId) {
        const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId, fleetPartnerId: fleetId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return vehicle;
    }
    async update(driverId, vehicleId, patch) {
        const vehicle = await this.findById(driverId, vehicleId);
        Object.assign(vehicle, patch);
        return this.vehicleRepo.save(vehicle);
    }
    async updateFleet(fleetId, vehicleId, patch) {
        const vehicle = await this.findFleetVehicleById(fleetId, vehicleId);
        Object.assign(vehicle, patch);
        return this.vehicleRepo.save(vehicle);
    }
    async remove(driverId, vehicleId) {
        const vehicle = await this.findById(driverId, vehicleId);
        await this.vehicleRepo.remove(vehicle);
        return { deleted: true };
    }
    async patchAccessories(driverId, vehicleId, accessories) {
        const vehicle = await this.findById(driverId, vehicleId);
        vehicle.accessories = accessories;
        return this.vehicleRepo.save(vehicle);
    }
    async uploadDocument(driverId, vehicleId, input) {
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
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map