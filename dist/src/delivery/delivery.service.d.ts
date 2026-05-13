import { Repository } from 'typeorm';
import { PresenceLocationService } from '../presence-location/presence-location.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import type { CreateDeliveryOrderDto } from './dto/delivery.dto';
import { DeliveryOrder } from '../entities/delivery-order.entity';
import { DeliveryRoute } from '../entities/delivery-route.entity';
import { Notification } from '../entities/notification.entity';
import { DriverProfile } from '../entities/driver-profile.entity';
export declare class DeliveryService {
    private orderRepo;
    private routeRepo;
    private notificationRepo;
    private driverProfileRepo;
    private readonly presenceLocationService?;
    private readonly realtimeGateway?;
    constructor(orderRepo: Repository<DeliveryOrder>, routeRepo: Repository<DeliveryRoute>, notificationRepo: Repository<Notification>, driverProfileRepo: Repository<DriverProfile>, presenceLocationService?: PresenceLocationService | undefined, realtimeGateway?: RealtimeGateway | undefined);
    createOrder(riderId: string, input: CreateDeliveryOrderDto): Promise<{
        order: DeliveryOrder;
        route: DeliveryRoute;
    }>;
    listOrders(driverId: string): Promise<DeliveryOrder[]>;
    acceptOrder(driverId: string, orderId: string): Promise<DeliveryOrder>;
    getRoute(driverId: string, routeId: string): Promise<DeliveryRoute>;
    pickupConfirm(driverId: string, routeId: string): Promise<DeliveryRoute>;
    qrVerify(driverId: string, routeId: string, qrValue: string): Promise<DeliveryRoute>;
    startRoute(driverId: string, routeId: string): Promise<DeliveryRoute>;
    completeStop(driverId: string, routeId: string, stopId: string): Promise<{
        routeId: string;
        stop: Record<string, any>;
        remainingStops: number;
    }>;
    dropoffComplete(driverId: string, routeId: string): Promise<DeliveryRoute>;
    private updateOrderFromRoute;
    private resolveDriverId;
}
