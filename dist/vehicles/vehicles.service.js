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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VehiclesService = class VehiclesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(driverId) {
        return this.prisma.vehicle.findMany({ where: { driverId } });
    }
    async listFleet(fleetId) {
        return this.prisma.vehicle.findMany({ where: { fleetPartnerId: fleetId } });
    }
    async createFleet(fleetId, input) {
        return this.prisma.vehicle.create({
            data: {
                fleetPartnerId: fleetId,
                driverId: '',
                make: input.make,
                model: input.model,
                year: input.year,
                licensePlate: input.plate,
                type: input.type,
                status: input.status,
                accessories: input.accessories ?? {},
            },
        });
    }
    async create(driverId, input) {
        return this.prisma.vehicle.create({
            data: {
                driverId,
                make: input.make,
                model: input.model,
                year: input.year,
                licensePlate: input.plate,
                type: input.type,
                status: input.status,
                accessories: input.accessories ?? {},
            },
        });
    }
    async findById(driverId, vehicleId) {
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, driverId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return vehicle;
    }
    async findFleetVehicleById(fleetId, vehicleId) {
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, fleetPartnerId: fleetId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return vehicle;
    }
    async update(driverId, vehicleId, patch) {
        await this.findById(driverId, vehicleId);
        return this.prisma.vehicle.update({ where: { id: vehicleId }, data: patch });
    }
    async updateFleet(fleetId, vehicleId, patch) {
        await this.findFleetVehicleById(fleetId, vehicleId);
        return this.prisma.vehicle.update({ where: { id: vehicleId }, data: patch });
    }
    async remove(driverId, vehicleId) {
        await this.findById(driverId, vehicleId);
        await this.prisma.vehicle.delete({ where: { id: vehicleId } });
        return { deleted: true };
    }
    async removeFleet(fleetId, vehicleId) {
        await this.findFleetVehicleById(fleetId, vehicleId);
        await this.prisma.vehicle.delete({ where: { id: vehicleId } });
        return { deleted: true };
    }
    async patchAccessories(driverId, vehicleId, accessories) {
        await this.findById(driverId, vehicleId);
        return this.prisma.vehicle.update({ where: { id: vehicleId }, data: { accessories } });
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
        await this.prisma.vehicle.update({ where: { id: vehicleId }, data: { documents } });
        return documents[input.documentType];
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map