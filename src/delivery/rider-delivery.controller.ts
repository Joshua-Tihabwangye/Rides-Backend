import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { CancelRiderDeliveryDto, CreateDeliveryOrderDto, PatchRiderDeliveryDto } from './dto/delivery.dto';
import { DeliveryService } from './delivery.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('rider')
@Controller('riders/me/deliveries')
export class RiderDeliveryController {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  async listOrders(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_DELIVERY_ORDERS_FETCHED',
      message: 'Rider delivery orders fetched',
      requestId: getRequestId(req),
      data: await this.deliveryService.listRiderOrders(user.riderId ?? user.userId),
    });
  }

  @Get(':orderId')
  async getOrder(
    @CurrentUser() user: AuthenticatedUser,
    @Param('orderId') orderId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_DELIVERY_ORDER_FETCHED',
      message: 'Rider delivery order fetched',
      requestId: getRequestId(req),
      data: await this.deliveryService.getRiderOrder(user.riderId ?? user.userId, orderId),
    });
  }

  @Post()
  async createOrder(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateDeliveryOrderDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DELIVERY_ORDER_CREATED',
      message: 'Delivery order created',
      requestId: getRequestId(req),
      data: await this.deliveryService.createOrder(user.riderId ?? user.userId, body),
    });
  }

  @Patch(':orderId')
  async patchOrder(
    @CurrentUser() user: AuthenticatedUser,
    @Param('orderId') orderId: string,
    @Body() body: PatchRiderDeliveryDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_DELIVERY_ORDER_UPDATED',
      message: 'Rider delivery order updated',
      requestId: getRequestId(req),
      data: await this.deliveryService.patchRiderOrder(user.riderId ?? user.userId, orderId, body),
    });
  }

  @Post(':orderId/cancel')
  async cancelOrder(
    @CurrentUser() user: AuthenticatedUser,
    @Param('orderId') orderId: string,
    @Body() body: CancelRiderDeliveryDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_DELIVERY_ORDER_CANCELLED',
      message: 'Rider delivery order cancelled',
      requestId: getRequestId(req),
      data: await this.deliveryService.cancelRiderOrder(user.riderId ?? user.userId, orderId, body.reason),
    });
  }
}
