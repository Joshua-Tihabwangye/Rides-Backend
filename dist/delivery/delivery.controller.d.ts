import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { VerifyDeliveryQrDto } from './dto/delivery.dto';
import { DeliveryService } from './delivery.service';
export declare class DeliveryController {
    private readonly deliveryService;
    private readonly apiResponse;
    constructor(deliveryService: DeliveryService, apiResponse: ApiResponseService);
    listOrders(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/delivery-order.entity").DeliveryOrder[]>>;
    acceptOrder(user: AuthenticatedUser, orderId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/delivery-order.entity").DeliveryOrder>>;
    getRoute(user: AuthenticatedUser, routeId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/delivery-route.entity").DeliveryRoute>>;
    pickupConfirm(user: AuthenticatedUser, routeId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/delivery-route.entity").DeliveryRoute>>;
    qrVerify(user: AuthenticatedUser, routeId: string, body: VerifyDeliveryQrDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/delivery-route.entity").DeliveryRoute>>;
    startRoute(user: AuthenticatedUser, routeId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/delivery-route.entity").DeliveryRoute>>;
    completeStop(user: AuthenticatedUser, routeId: string, stopId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        routeId: string;
        stop: Record<string, any>;
        remainingStops: number;
    }>>;
    dropoffComplete(user: AuthenticatedUser, routeId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/delivery-route.entity").DeliveryRoute>>;
}
