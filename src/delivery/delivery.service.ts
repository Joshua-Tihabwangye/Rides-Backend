import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PresenceLocationService } from '../presence-location/presence-location.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { RiderRealtimeGateway } from '../realtime/scoped-realtime.gateway';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { KafkaTopics } from '../kafka/kafka.topics';
import type { CreateDeliveryOrderDto } from './dto/delivery.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly presenceLocationService?: PresenceLocationService,
    @Optional() private readonly realtimeGateway?: RealtimeGateway,
    @Optional() private readonly riderRealtimeGateway?: RiderRealtimeGateway,
    @Optional() private readonly kafka?: KafkaProducerService,
  ) {}

  async createOrder(riderId: string, input: CreateDeliveryOrderDto) {
    const assignedDriverId = await this.resolveDriverId(input);
    const routeId = uuidv4();
    const orderId = uuidv4();

    const order = await this.prisma.deliveryOrder.create({
      data: {
        id: orderId,
        riderId,
        driverId: assignedDriverId,
        status: 'requested',
        routeId,
        pickup: input.pickupAddress as any,
        dropoff: input.dropoffAddress as any,
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
          { id: uuidv4(), routeId, status: 'pending', address: input.pickupAddress },
          { id: uuidv4(), routeId, status: 'pending', address: input.dropoffAddress },
        ] as any,
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

  async listRiderOrders(riderId: string) {
    const orders = await this.prisma.deliveryOrder.findMany({
      where: { riderId },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => this.toRiderDeliveryResponse(order));
  }

  async getRiderOrder(riderId: string, orderId: string) {
    const order = await this.prisma.deliveryOrder.findFirst({ where: { id: orderId, riderId } });
    if (!order) {
      throw new NotFoundException('Delivery order not found');
    }
    return this.toRiderDeliveryResponse(order);
  }

  async patchRiderOrder(
    riderId: string,
    orderId: string,
    patch: Partial<{ status: 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'failed' }>,
  ) {
    const order = await this.prisma.deliveryOrder.findFirst({ where: { id: orderId, riderId } });
    if (!order) {
      throw new NotFoundException('Delivery order not found');
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

  async cancelRiderOrder(riderId: string, orderId: string, reason?: string) {
    const order = await this.prisma.deliveryOrder.findFirst({ where: { id: orderId, riderId } });
    if (!order) {
      throw new NotFoundException('Delivery order not found');
    }

    const updated = await this.prisma.deliveryOrder.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });
    await this.syncRouteStatus(order.routeId, 'cancelled');
    this.publishRiderDeliveryPatch(riderId, order.id, 'cancelled', reason || 'Delivery cancelled');

    return this.toRiderDeliveryResponse(updated);
  }

  async listOrders(driverId: string) {
    return this.prisma.deliveryOrder.findMany({ where: { driverId } });
  }

  async acceptOrder(driverId: string, orderId: string) {
    const order = await this.prisma.deliveryOrder.findFirst({ where: { id: orderId, driverId } });
    if (!order) {
      throw new NotFoundException('Delivery order not found');
    }

    const updated = await this.prisma.deliveryOrder.update({
      where: { id: orderId },
      data: { status: 'accepted' },
    });
    this.publishRiderDeliveryPatch(updated.riderId, updated.id, 'accepted', 'Driver accepted delivery');
    return updated;
  }

  async getRoute(driverId: string, routeId: string) {
    const route = await this.prisma.deliveryRoute.findFirst({ where: { id: routeId, driverId } });
    if (!route) {
      throw new NotFoundException('Delivery route not found');
    }
    return route;
  }

  async pickupConfirm(driverId: string, routeId: string) {
    const route = await this.getRoute(driverId, routeId);
    await this.prisma.deliveryRoute.update({
      where: { id: routeId },
      data: { status: 'pickup_confirmed' },
    });
    await this.updateOrderFromRoute(routeId, 'picked_up');
    return { ...route, status: 'pickup_confirmed' };
  }

  async qrVerify(driverId: string, routeId: string, qrValue: string) {
    if (!qrValue.trim()) {
      throw new BadRequestException('QR value is required');
    }

    const route = await this.getRoute(driverId, routeId);
    if (route.status !== 'pickup_confirmed') {
      throw new BadRequestException('Route must be pickup_confirmed before QR verification');
    }

    return this.prisma.deliveryRoute.update({
      where: { id: routeId },
      data: { status: 'qr_verified' },
    });
  }

  async startRoute(driverId: string, routeId: string) {
    const route = await this.getRoute(driverId, routeId);
    if (!['pickup_confirmed', 'qr_verified'].includes(route.status)) {
      throw new BadRequestException('Route is not ready to start');
    }
    await this.prisma.deliveryRoute.update({
      where: { id: routeId },
      data: { status: 'in_progress' },
    });
    await this.updateOrderFromRoute(routeId, 'in_transit');
    return { ...route, status: 'in_progress' };
  }

  async completeStop(driverId: string, routeId: string, stopId: string) {
    const route = await this.getRoute(driverId, routeId);
    const stops = (route.stops as Array<Record<string, any>>) || [];
    const stop = stops.find((item: any) => item.id === stopId);
    if (!stop) {
      throw new NotFoundException('Delivery stop not found');
    }

    stop.status = 'completed';
    await this.prisma.deliveryRoute.update({
      where: { id: routeId },
      data: { stops: stops as any },
    });

    return {
      routeId,
      stop,
      remainingStops: stops.filter((item: any) => item.status !== 'completed').length,
    };
  }

  async dropoffComplete(driverId: string, routeId: string) {
    const route = await this.getRoute(driverId, routeId);
    const stops = (route.stops as Array<Record<string, any>>) || [];
    const incomplete = stops.filter((item: any) => item.status !== 'completed');
    if (incomplete.length > 0) {
      throw new BadRequestException('All stops must be completed before dropoff confirmation');
    }

    await this.prisma.deliveryRoute.update({
      where: { id: routeId },
      data: { status: 'completed' },
    });
    await this.updateOrderFromRoute(routeId, 'delivered');
    return { ...route, status: 'completed' };
  }

  private async updateOrderFromRoute(routeId: string, status: string) {
    const order = await this.prisma.deliveryOrder.findFirst({ where: { routeId } });
    if (order) {
      const updated = await this.prisma.deliveryOrder.update({
        where: { id: order.id },
        data: { status: status as any },
      });
      this.publishRiderDeliveryPatch(updated.riderId, updated.id, this.toRealtimeStatus(updated.status), 'Delivery status updated');
    }
  }

  private async resolveDriverId(input: CreateDeliveryOrderDto) {
    if (input.pickupLat !== undefined && input.pickupLng !== undefined) {
      const nearbyDrivers =
        (await this.presenceLocationService?.findNearbyDrivers(input.pickupLat, input.pickupLng, 5000)) ?? [];
      if (nearbyDrivers.length > 0) {
        return nearbyDrivers[0].driverId;
      }
    }

    const firstDriver = await this.prisma.driverProfile.findFirst();
    if (!firstDriver) {
      throw new NotFoundException('No driver available for delivery assignment');
    }
    return firstDriver.userId;
  }

  private async syncRouteStatus(routeId: string | null | undefined, orderStatus: string) {
    if (!routeId) return;
    const route = await this.prisma.deliveryRoute.findUnique({ where: { id: routeId } });
    if (!route) return;

    let routeStatus = route.status;
    if (orderStatus === 'cancelled') {
      routeStatus = 'cancelled';
    } else if (orderStatus === 'delivered') {
      routeStatus = 'completed';
    } else if (orderStatus === 'in_transit' || orderStatus === 'out_for_delivery') {
      routeStatus = 'in_progress';
    } else if (orderStatus === 'picked_up') {
      routeStatus = 'pickup_confirmed';
    } else if (orderStatus === 'accepted') {
      routeStatus = 'pending';
    }

    await this.prisma.deliveryRoute.update({
      where: { id: routeId },
      data: { status: routeStatus as any },
    });
  }

  private toRiderDeliveryResponse(order: any) {
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

  private toAddressLabel(value: unknown): string {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') {
      const candidate = (value as Record<string, unknown>).address;
      if (typeof candidate === 'string') return candidate;
      return JSON.stringify(value);
    }
    return '';
  }

  private toItemDescription(items: unknown): string | undefined {
    if (!Array.isArray(items) || !items.length) return undefined;
    return `Items (${items.length})`;
  }

  private toApiStatus(
    status: string,
  ): 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' {
    if (status === 'accepted') return 'accepted';
    if (status === 'picked_up') return 'picked_up';
    if (status === 'in_transit' || status === 'out_for_delivery') return 'in_transit';
    if (status === 'delivered') return 'delivered';
    if (status === 'cancelled' || status === 'failed') return 'cancelled';
    return 'pending';
  }

  private toRealtimeStatus(
    status: string,
  ): 'draft' | 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'partially_completed' | 'delivered' | 'cancelled' | 'failed' {
    if (
      status === 'requested' ||
      status === 'accepted' ||
      status === 'picked_up' ||
      status === 'in_transit' ||
      status === 'out_for_delivery' ||
      status === 'partially_completed' ||
      status === 'delivered' ||
      status === 'cancelled' ||
      status === 'failed'
    ) {
      return status;
    }
    return 'draft';
  }

  private publishRiderDeliveryPatch(
    riderId: string,
    orderId: string,
    status: 'draft' | 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'partially_completed' | 'delivered' | 'cancelled' | 'failed',
    note?: string,
  ) {
    const payload = {
      orderId,
      riderId,
      status,
      note,
      tracking: {
        updatedAt: new Date().toISOString(),
      },
    };
    this.riderRealtimeGateway?.publishToUser(riderId, 'delivery.patch', payload);
    this.kafka?.emit(KafkaTopics.DELIVERIES, 'delivery.status.updated', payload, {
      key: orderId,
      userId: riderId,
    });
  }
}
