import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { CreateVehicleDto, UpdateAccessoriesDto, UpdateVehicleDto, UploadVehicleDocumentDto } from './dto/vehicle.dto';
import { VehiclesService } from './vehicles.service';
export declare class VehiclesController {
    private readonly vehiclesService;
    private readonly apiResponse;
    constructor(vehiclesService: VehiclesService, apiResponse: ApiResponseService);
    list(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/vehicle.entity").Vehicle[]>>;
    create(user: AuthenticatedUser, body: CreateVehicleDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/vehicle.entity").Vehicle>>;
    getById(user: AuthenticatedUser, vehicleId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/vehicle.entity").Vehicle>>;
    patch(user: AuthenticatedUser, vehicleId: string, body: UpdateVehicleDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/vehicle.entity").Vehicle>>;
    remove(user: AuthenticatedUser, vehicleId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    patchAccessories(user: AuthenticatedUser, vehicleId: string, body: UpdateAccessoriesDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/vehicle.entity").Vehicle>>;
    postDocument(user: AuthenticatedUser, vehicleId: string, body: UploadVehicleDocumentDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<any>>;
}
