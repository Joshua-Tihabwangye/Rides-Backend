import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { VehiclesService } from './vehicles.service';
export declare class FleetVehiclesController {
    private readonly vehiclesService;
    private readonly apiResponse;
    constructor(vehiclesService: VehiclesService, apiResponse: ApiResponseService);
    list(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/vehicle.entity").Vehicle[]>>;
    getById(user: AuthenticatedUser, vehicleId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/vehicle.entity").Vehicle>>;
    create(user: AuthenticatedUser, body: CreateVehicleDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/vehicle.entity").Vehicle>>;
    patch(user: AuthenticatedUser, vehicleId: string, body: UpdateVehicleDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/vehicle.entity").Vehicle>>;
    deleteById(user: AuthenticatedUser, vehicleId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    listDocuments(user: AuthenticatedUser, vehicleId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        documentType: string;
    }[]>>;
    createDocument(user: AuthenticatedUser, vehicleId: string, body: {
        documentType: string;
        fileUrl: string;
        expiryDate?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<any>>;
    listMaintenance(user: AuthenticatedUser, vehicleId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<any>>;
    createMaintenance(user: AuthenticatedUser, vehicleId: string, body: {
        title: string;
        notes?: string;
        cost?: number;
        servicedAt?: number;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        title: string;
        notes: string | undefined;
        cost: number;
        servicedAt: number;
        createdAt: number;
    }>>;
}
