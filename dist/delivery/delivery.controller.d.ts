import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { VerifyDeliveryQrDto } from './dto/delivery.dto';
import { DeliveryService } from './delivery.service';
export declare class DeliveryController {
    private readonly deliveryService;
    private readonly apiResponse;
    constructor(deliveryService: DeliveryService, apiResponse: ApiResponseService);
    listOrders(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.DeliveryOrderStatus;
        id: string;
        driverId: string | null;
        riderId: string;
        createdAt: Date;
        updatedAt: Date;
        pickup: import("@prisma/client/runtime/client").JsonValue;
        dropoff: import("@prisma/client/runtime/client").JsonValue;
        fare: import("@prisma/client-runtime-utils").Decimal;
        routeId: string | null;
        items: import("@prisma/client/runtime/client").JsonValue | null;
        qrCode: string | null;
    }[]>>;
    acceptOrder(user: AuthenticatedUser, orderId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.DeliveryOrderStatus;
        id: string;
        driverId: string | null;
        riderId: string;
        createdAt: Date;
        updatedAt: Date;
        pickup: import("@prisma/client/runtime/client").JsonValue;
        dropoff: import("@prisma/client/runtime/client").JsonValue;
        fare: import("@prisma/client-runtime-utils").Decimal;
        routeId: string | null;
        items: import("@prisma/client/runtime/client").JsonValue | null;
        qrCode: string | null;
    }>>;
    getRoute(user: AuthenticatedUser, routeId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.DeliveryRouteStatus;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        stops: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    pickupConfirm(user: AuthenticatedUser, routeId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: string;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        stops: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    qrVerify(user: AuthenticatedUser, routeId: string, body: VerifyDeliveryQrDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.DeliveryRouteStatus;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        stops: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    startRoute(user: AuthenticatedUser, routeId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: string;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        stops: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    completeStop(user: AuthenticatedUser, routeId: string, stopId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        routeId: string;
        stop: Record<string, any>;
        remainingStops: number;
    }>>;
    dropoffComplete(user: AuthenticatedUser, routeId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: string;
        id: string;
        driverId: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        stops: import("@prisma/client/runtime/client").JsonValue;
    }>>;
}
