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
const prisma_service_1 = require("../prisma/prisma.service");
const presence_location_service_1 = require("../presence-location/presence-location.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const scoped_realtime_gateway_1 = require("../realtime/scoped-realtime.gateway");
const uuid_1 = require("uuid");
let DeliveryService = class DeliveryService {
    constructor(prisma, presenceLocationService, realtimeGateway, riderRealtimeGateway) {
        this.prisma = prisma;
        this.presenceLocationService = presenceLocationService;
        this.realtimeGateway = realtimeGateway;
        this.riderRealtimeGateway = riderRealtimeGateway;
    }
    async createOrder(riderId, input) {
        const assignedDriverId = await this.resolveDriverId(input);
        const routeId = (0, uuid_1.v4)();
        const orderId = (0, uuid_1.v4)();
        const order = await this.prisma.deliveryOrder.create({
            data: {
                id: orderId,
                riderId,
                driverId: assignedDriverId,
                status: 'requested',
                routeId,
                pickup: input.pickupAddress,
                dropoff: input.dropoffAddress,
                qrCode: `QR-${orderId.slice(0, 8).toUpperCase()}`,
            },
        });
        await this.prisma.deliveryRoute.create({
            data: {
                id: routeId,
                driverId: assignedDriverId,
                orderId,
                status: 'pending',
                stops: [
                    { id: (0, uuid_1.v4)(), routeId, status: 'pending', address: input.pickupAddress },
                    { id: (0, uuid_1.v4)(), routeId, status: 'pending', address: input.dropoffAddress },
                ],
            },
        });
        await this.prisma.notification.create({
            data: {
                userId: assignedDriverId,
                userType: 'driver',
                title: 'New delivery order',
                body: `${input.pickupAddress || 'Pickup'} to ${input.dropoffAddress || 'Dropoff'}`,
                isRead: false,
                read: false,
            },
        });
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
        const orders = await this.prisma.deliveryOrder.findMany({
            where: { riderId },
            orderBy: { createdAt: 'desc' },
        });
        return orders.map((order) => this.toRiderDeliveryResponse(order));
    }
    async getRiderOrder(riderId, orderId) {
        const order = await this.prisma.deliveryOrder.findFirst({ where: { id: orderId, riderId } });
        if (!order) {
            throw new common_1.NotFoundException('Delivery order not found');
        }
        return this.toRiderDeliveryResponse(order);
    }
    async patchRiderOrder(riderId, orderId, patch) {
        const order = await this.prisma.deliveryOrder.findFirst({ where: { id: orderId, riderId } });
        if (!order) {
            throw new common_1.NotFoundException('Delivery order not found');
        }
        if (patch.status) {
            await this.syncRouteStatus(order.routeId, patch.status);
            this.publishRiderDeliveryPatch(riderId, order.id, patch.status, 'Delivery updated');
        }
        const updated = await this.prisma.deliveryOrder.update({
            where: { id: orderId },
            data: { status: patch.status },
        });
        return this.toRiderDeliveryResponse(updated);
    }
    async cancelRiderOrder(riderId, orderId, reason) {
        const order = await this.prisma.deliveryOrder.findFirst({ where: { id: orderId, riderId } });
        if (!order) {
            throw new common_1.NotFoundException('Delivery order not found');
        }
        const updated = await this.prisma.deliveryOrder.update({
            where: { id: orderId },
            data: { status: 'cancelled' },
        });
        await this.syncRouteStatus(order.routeId, 'cancelled');
        this.publishRiderDeliveryPatch(riderId, order.id, 'cancelled', reason || 'Delivery cancelled');
        return this.toRiderDeliveryResponse(updated);
    }
    async listOrders(driverId) {
        return this.prisma.deliveryOrder.findMany({ where: { driverId } });
    }
    async acceptOrder(driverId, orderId) {
        const order = await this.prisma.deliveryOrder.findFirst({ where: { id: orderId, driverId } });
        if (!order) {
            throw new common_1.NotFoundException('Delivery order not found');
        }
        const updated = await this.prisma.deliveryOrder.update({
            where: { id: orderId },
            data: { status: 'accepted' },
        });
        this.publishRiderDeliveryPatch(updated.riderId, updated.id, 'accepted', 'Driver accepted delivery');
        return updated;
    }
    async getRoute(driverId, routeId) {
        const route = await this.prisma.deliveryRoute.findFirst({ where: { id: routeId, driverId } });
        if (!route) {
            throw new common_1.NotFoundException('Delivery route not found');
        }
        return route;
    }
    async pickupConfirm(driverId, routeId) {
        const route = await this.getRoute(driverId, routeId);
        await this.prisma.deliveryRoute.update({
            where: { id: routeId },
            data: { status: 'pickup_confirmed' },
        });
        await this.updateOrderFromRoute(routeId, 'picked_up');
        return { ...route, status: 'pickup_confirmed' };
    }
    async qrVerify(driverId, routeId, qrValue) {
        if (!qrValue.trim()) {
            throw new common_1.BadRequestException('QR value is required');
        }
        const route = await this.getRoute(driverId, routeId);
        if (route.status !== 'pickup_confirmed') {
            throw new common_1.BadRequestException('Route must be pickup_confirmed before QR verification');
        }
        return this.prisma.deliveryRoute.update({
            where: { id: routeId },
            data: { status: 'qr_verified' },
        });
    }
    async startRoute(driverId, routeId) {
        const route = await this.getRoute(driverId, routeId);
        if (!['pickup_confirmed', 'qr_verified'].includes(route.status)) {
            throw new common_1.BadRequestException('Route is not ready to start');
        }
        await this.prisma.deliveryRoute.update({
            where: { id: routeId },
            data: { status: 'in_progress' },
        });
        await this.updateOrderFromRoute(routeId, 'in_transit');
        return { ...route, status: 'in_progress' };
    }
    async completeStop(driverId, routeId, stopId) {
        const route = await this.getRoute(driverId, routeId);
        const stops = route.stops || [];
        const stop = stops.find((item) => item.id === stopId);
        if (!stop) {
            throw new common_1.NotFoundException('Delivery stop not found');
        }
        stop.status = 'completed';
        await this.prisma.deliveryRoute.update({
            where: { id: routeId },
            data: { stops: stops },
        });
        return {
            routeId,
            stop,
            remainingStops: stops.filter((item) => item.status !== 'completed').length,
        };
    }
    async dropoffComplete(driverId, routeId) {
        const route = await this.getRoute(driverId, routeId);
        const stops = route.stops || [];
        const incomplete = stops.filter((item) => item.status !== 'completed');
        if (incomplete.length > 0) {
            throw new common_1.BadRequestException('All stops must be completed before dropoff confirmation');
        }
        await this.prisma.deliveryRoute.update({
            where: { id: routeId },
            data: { status: 'completed' },
        });
        await this.updateOrderFromRoute(routeId, 'delivered');
        return { ...route, status: 'completed' };
    }
    async updateOrderFromRoute(routeId, status) {
        const order = await this.prisma.deliveryOrder.findFirst({ where: { routeId } });
        if (order) {
            const updated = await this.prisma.deliveryOrder.update({
                where: { id: order.id },
                data: { status: status },
            });
            this.publishRiderDeliveryPatch(updated.riderId, updated.id, this.toRealtimeStatus(updated.status), 'Delivery status updated');
        }
    }
    async resolveDriverId(input) {
        if (input.pickupLat !== undefined && input.pickupLng !== undefined) {
            const nearbyDrivers = (await this.presenceLocationService?.findNearbyDrivers(input.pickupLat, input.pickupLng, 5000)) ?? [];
            if (nearbyDrivers.length > 0) {
                return nearbyDrivers[0].driverId;
            }
        }
        const firstDriver = await this.prisma.driverProfile.findFirst();
        if (!firstDriver) {
            throw new common_1.NotFoundException('No driver available for delivery assignment');
        }
        return firstDriver.userId;
    }
    async syncRouteStatus(routeId, orderStatus) {
        if (!routeId)
            return;
        const route = await this.prisma.deliveryRoute.findUnique({ where: { id: routeId } });
        if (!route)
            return;
        let routeStatus = route.status;
        if (orderStatus === 'cancelled') {
            routeStatus = 'cancelled';
        }
        else if (orderStatus === 'delivered') {
            routeStatus = 'completed';
        }
        else if (orderStatus === 'in_transit' || orderStatus === 'out_for_delivery') {
            routeStatus = 'in_progress';
        }
        else if (orderStatus === 'picked_up') {
            routeStatus = 'pickup_confirmed';
        }
        else if (orderStatus === 'accepted') {
            routeStatus = 'pending';
        }
        await this.prisma.deliveryRoute.update({
            where: { id: routeId },
            data: { status: routeStatus },
        });
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
    __param(1, (0, common_1.Optional)()),
    __param(2, (0, common_1.Optional)()),
    __param(3, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        presence_location_service_1.PresenceLocationService,
        realtime_gateway_1.RealtimeGateway,
        scoped_realtime_gateway_1.RiderRealtimeGateway])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map