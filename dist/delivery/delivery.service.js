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
exports.DeliveryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const presence_location_service_1 = require("../presence-location/presence-location.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const scoped_realtime_gateway_1 = require("../realtime/scoped-realtime.gateway");
const delivery_order_entity_1 = require("../entities/delivery-order.entity");
const delivery_route_entity_1 = require("../entities/delivery-route.entity");
const notification_entity_1 = require("../entities/notification.entity");
const driver_profile_entity_1 = require("../entities/driver-profile.entity");
const uuid_1 = require("uuid");
let DeliveryService = class DeliveryService {
    constructor(orderRepo, routeRepo, notificationRepo, driverProfileRepo, presenceLocationService, realtimeGateway, riderRealtimeGateway) {
        this.orderRepo = orderRepo;
        this.routeRepo = routeRepo;
        this.notificationRepo = notificationRepo;
        this.driverProfileRepo = driverProfileRepo;
        this.presenceLocationService = presenceLocationService;
        this.realtimeGateway = realtimeGateway;
        this.riderRealtimeGateway = riderRealtimeGateway;
    }
    async createOrder(riderId, input) {
        const assignedDriverId = await this.resolveDriverId(input);
        const routeId = (0, uuid_1.v4)();
        const orderId = (0, uuid_1.v4)();
        const order = this.orderRepo.create({
            id: orderId,
            riderId,
            driverId: assignedDriverId,
            status: 'requested',
            routeId,
            pickup: input.pickupAddress,
            dropoff: input.dropoffAddress,
            qrCode: `QR-${orderId.slice(0, 8).toUpperCase()}`,
        });
        const route = this.routeRepo.create({
            id: routeId,
            driverId: assignedDriverId,
            orderId,
            status: 'pending',
            stops: [
                { id: (0, uuid_1.v4)(), routeId, status: 'pending', address: input.pickupAddress },
                { id: (0, uuid_1.v4)(), routeId, status: 'pending', address: input.dropoffAddress },
            ],
        });
        await this.orderRepo.save(order);
        await this.routeRepo.save(route);
        const notification = this.notificationRepo.create({
            userId: assignedDriverId,
            userType: 'driver',
            title: 'New delivery order',
            body: `${input.pickupAddress || 'Pickup'} to ${input.dropoffAddress || 'Dropoff'}`,
            isRead: false,
        });
        await this.notificationRepo.save(notification);
        this.realtimeGateway?.publishEvent({
            driverId: assignedDriverId,
            routeId,
            event: 'delivery.order.new',
            payload: {
                orderId,
                routeId,
                riderId,
                pickupAddress: input.pickupAddress,
                dropoffAddress: input.dropoffAddress,
            },
        });
        this.publishRiderDeliveryPatch(riderId, orderId, 'requested', 'Delivery request created');
        return this.toRiderDeliveryResponse(order);
    }
    async listRiderOrders(riderId) {
        const orders = await this.orderRepo.find({
            where: { riderId },
            order: { createdAt: 'DESC' },
        });
        return orders.map((order) => this.toRiderDeliveryResponse(order));
    }
    async getRiderOrder(riderId, orderId) {
        const order = await this.orderRepo.findOne({ where: { id: orderId, riderId } });
        if (!order) {
            throw new common_1.NotFoundException('Delivery order not found');
        }
        return this.toRiderDeliveryResponse(order);
    }
    async patchRiderOrder(riderId, orderId, patch) {
        const order = await this.orderRepo.findOne({ where: { id: orderId, riderId } });
        if (!order) {
            throw new common_1.NotFoundException('Delivery order not found');
        }
        if (patch.status) {
            order.status = patch.status;
            await this.syncRouteStatus(order.routeId, patch.status);
            this.publishRiderDeliveryPatch(riderId, order.id, patch.status, 'Delivery updated');
        }
        await this.orderRepo.save(order);
        return this.toRiderDeliveryResponse(order);
    }
    async cancelRiderOrder(riderId, orderId, reason) {
        const order = await this.orderRepo.findOne({ where: { id: orderId, riderId } });
        if (!order) {
            throw new common_1.NotFoundException('Delivery order not found');
        }
        order.status = 'cancelled';
        await this.orderRepo.save(order);
        await this.syncRouteStatus(order.routeId, 'cancelled');
        this.publishRiderDeliveryPatch(riderId, order.id, 'cancelled', reason || 'Delivery cancelled');
        return this.toRiderDeliveryResponse(order);
    }
    async listOrders(driverId) {
        return this.orderRepo.find({ where: { driverId } });
    }
    async acceptOrder(driverId, orderId) {
        const order = await this.orderRepo.findOne({ where: { id: orderId, driverId } });
        if (!order) {
            throw new common_1.NotFoundException('Delivery order not found');
        }
        order.status = 'accepted';
        const saved = await this.orderRepo.save(order);
        this.publishRiderDeliveryPatch(saved.riderId, saved.id, 'accepted', 'Driver accepted delivery');
        return saved;
    }
    async getRoute(driverId, routeId) {
        const route = await this.routeRepo.findOne({ where: { id: routeId, driverId } });
        if (!route) {
            throw new common_1.NotFoundException('Delivery route not found');
        }
        return route;
    }
    async pickupConfirm(driverId, routeId) {
        const route = await this.getRoute(driverId, routeId);
        route.status = 'pickup_confirmed';
        await this.routeRepo.save(route);
        await this.updateOrderFromRoute(routeId, 'picked_up');
        return route;
    }
    async qrVerify(driverId, routeId, qrValue) {
        if (!qrValue.trim()) {
            throw new common_1.BadRequestException('QR value is required');
        }
        const route = await this.getRoute(driverId, routeId);
        if (route.status !== 'pickup_confirmed') {
            throw new common_1.BadRequestException('Route must be pickup_confirmed before QR verification');
        }
        route.status = 'qr_verified';
        return this.routeRepo.save(route);
    }
    async startRoute(driverId, routeId) {
        const route = await this.getRoute(driverId, routeId);
        if (!['pickup_confirmed', 'qr_verified'].includes(route.status)) {
            throw new common_1.BadRequestException('Route is not ready to start');
        }
        route.status = 'in_progress';
        await this.routeRepo.save(route);
        await this.updateOrderFromRoute(routeId, 'in_transit');
        return route;
    }
    async completeStop(driverId, routeId, stopId) {
        const route = await this.getRoute(driverId, routeId);
        const stop = route.stops.find((item) => item.id === stopId);
        if (!stop) {
            throw new common_1.NotFoundException('Delivery stop not found');
        }
        stop.status = 'completed';
        await this.routeRepo.save(route);
        return {
            routeId,
            stop,
            remainingStops: route.stops.filter((item) => item.status !== 'completed').length,
        };
    }
    async dropoffComplete(driverId, routeId) {
        const route = await this.getRoute(driverId, routeId);
        const incomplete = route.stops.filter((item) => item.status !== 'completed');
        if (incomplete.length > 0) {
            throw new common_1.BadRequestException('All stops must be completed before dropoff confirmation');
        }
        route.status = 'completed';
        await this.routeRepo.save(route);
        await this.updateOrderFromRoute(routeId, 'delivered');
        return route;
    }
    async updateOrderFromRoute(routeId, status) {
        const order = await this.orderRepo.findOne({ where: { routeId } });
        if (order) {
            order.status = status;
            const saved = await this.orderRepo.save(order);
            this.publishRiderDeliveryPatch(saved.riderId, saved.id, this.toRealtimeStatus(saved.status), 'Delivery status updated');
        }
    }
    async resolveDriverId(input) {
        if (input.pickupLat !== undefined && input.pickupLng !== undefined) {
            const nearbyDrivers = (await this.presenceLocationService?.findNearbyDrivers(input.pickupLat, input.pickupLng, 5000)) ?? [];
            if (nearbyDrivers.length > 0) {
                return nearbyDrivers[0].driverId;
            }
        }
        const firstDriver = await this.driverProfileRepo.findOne({ where: {} });
        if (!firstDriver) {
            throw new common_1.NotFoundException('No driver available for delivery assignment');
        }
        return firstDriver.userId;
    }
    async syncRouteStatus(routeId, orderStatus) {
        if (!routeId)
            return;
        const route = await this.routeRepo.findOne({ where: { id: routeId } });
        if (!route)
            return;
        if (orderStatus === 'cancelled') {
            route.status = 'cancelled';
        }
        else if (orderStatus === 'delivered') {
            route.status = 'completed';
        }
        else if (orderStatus === 'in_transit' || orderStatus === 'out_for_delivery') {
            route.status = 'in_progress';
        }
        else if (orderStatus === 'picked_up') {
            route.status = 'pickup_confirmed';
        }
        else if (orderStatus === 'accepted') {
            route.status = 'pending';
        }
        await this.routeRepo.save(route);
    }
    toRiderDeliveryResponse(order) {
        return {
            id: order.id,
            riderId: order.riderId,
            driverId: order.driverId,
            status: this.toApiStatus(order.status),
            pickupAddress: this.toAddressLabel(order.pickup),
            dropoffAddress: this.toAddressLabel(order.dropoff),
            itemDescription: this.toItemDescription(order.items),
            routeId: order.routeId,
            requestedAt: new Date(order.createdAt).getTime(),
            updatedAt: new Date(order.updatedAt).getTime(),
            pickedUpAt: undefined,
            deliveredAt: order.status === 'delivered' ? new Date(order.updatedAt).getTime() : undefined,
        };
    }
    toAddressLabel(value) {
        if (typeof value === 'string')
            return value;
        if (value && typeof value === 'object') {
            const candidate = value.address;
            if (typeof candidate === 'string')
                return candidate;
            return JSON.stringify(value);
        }
        return '';
    }
    toItemDescription(items) {
        if (!Array.isArray(items) || !items.length)
            return undefined;
        return `Items (${items.length})`;
    }
    toApiStatus(status) {
        if (status === 'accepted')
            return 'accepted';
        if (status === 'picked_up')
            return 'picked_up';
        if (status === 'in_transit' || status === 'out_for_delivery')
            return 'in_transit';
        if (status === 'delivered')
            return 'delivered';
        if (status === 'cancelled' || status === 'failed')
            return 'cancelled';
        return 'pending';
    }
    toRealtimeStatus(status) {
        if (status === 'requested' ||
            status === 'accepted' ||
            status === 'picked_up' ||
            status === 'in_transit' ||
            status === 'out_for_delivery' ||
            status === 'partially_completed' ||
            status === 'delivered' ||
            status === 'cancelled' ||
            status === 'failed') {
            return status;
        }
        return 'draft';
    }
    publishRiderDeliveryPatch(riderId, orderId, status, note) {
        this.riderRealtimeGateway?.publishToUser(riderId, 'delivery.patch', {
            orderId,
            status,
            note,
            tracking: {
                updatedAt: new Date().toISOString(),
            },
        });
    }
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(delivery_order_entity_1.DeliveryOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(delivery_route_entity_1.DeliveryRoute)),
    __param(2, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(3, (0, typeorm_1.InjectRepository)(driver_profile_entity_1.DriverProfile)),
    __param(4, (0, common_1.Optional)()),
    __param(5, (0, common_1.Optional)()),
    __param(6, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        presence_location_service_1.PresenceLocationService,
        realtime_gateway_1.RealtimeGateway,
        scoped_realtime_gateway_1.RiderRealtimeGateway])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map