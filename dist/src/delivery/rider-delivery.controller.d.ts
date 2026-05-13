import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { CreateDeliveryOrderDto } from './dto/delivery.dto';
import { DeliveryService } from './delivery.service';
export declare class RiderDeliveryController {
    private readonly deliveryService;
    private readonly apiResponse;
    constructor(deliveryService: DeliveryService, apiResponse: ApiResponseService);
    createOrder(user: AuthenticatedUser, body: CreateDeliveryOrderDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        order: import("../entities/delivery-order.entity").DeliveryOrder;
        route: import("../entities/delivery-route.entity").DeliveryRoute;
    }>>;
}
