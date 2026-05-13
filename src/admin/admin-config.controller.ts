import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import {
  CreatePricingConfigDto,
  CreatePromoDto,
  CreateServiceConfigDto,
  UpdatePricingConfigDto,
  UpdatePromoDto,
  UpdateServiceConfigDto,
} from './dto/admin.dto';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller('admin')
export class AdminConfigController {
  constructor(
    private readonly adminService: AdminService,
    private readonly apiResponse: ApiResponseService,
  ) {}

   @Get('pricing')
   async listPricing(@Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_PRICING_FETCHED',
       message: 'Pricing configs fetched',
       requestId: getRequestId(req),
       data: await this.adminService.listPricing(),
     });
   }

   @Get('pricing/:pricingId')
   async getPricing(@Param('pricingId') pricingId: string, @Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_PRICING_FETCHED',
       message: 'Pricing config fetched',
       requestId: getRequestId(req),
       data: await this.adminService.getPricing(pricingId),
     });
   }

  @Post('pricing')
  async createPricing(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreatePricingConfigDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_PRICING_CREATED',
      message: 'Pricing config created',
      requestId: getRequestId(req),
      data: await this.adminService.createPricing(
        user.userId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('pricing/:pricingId')
  async patchPricing(
    @CurrentUser() user: AuthenticatedUser,
    @Param('pricingId') pricingId: string,
    @Body() body: UpdatePricingConfigDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_PRICING_UPDATED',
      message: 'Pricing config updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchPricing(
        user.userId,
        pricingId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

   @Get('promos')
   async listPromos(@Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_PROMOS_FETCHED',
       message: 'Promos fetched',
       requestId: getRequestId(req),
       data: await this.adminService.listPromos(),
     });
   }

   @Get('promos/:promoId')
   async getPromo(@Param('promoId') promoId: string, @Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_PROMO_FETCHED',
       message: 'Promo fetched',
       requestId: getRequestId(req),
       data: await this.adminService.getPromo(promoId),
     });
   }

  @Post('promos')
  async createPromo(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreatePromoDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_PROMO_CREATED',
      message: 'Promo created',
      requestId: getRequestId(req),
      data: await this.adminService.createPromo(
        user.userId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('promos/:promoId')
  async patchPromo(
    @CurrentUser() user: AuthenticatedUser,
    @Param('promoId') promoId: string,
    @Body() body: UpdatePromoDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_PROMO_UPDATED',
      message: 'Promo updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchPromo(
        user.userId,
        promoId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

   @Get('services')
   async listServices(@Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_SERVICES_FETCHED',
       message: 'Service configs fetched',
       requestId: getRequestId(req),
       data: await this.adminService.listServices(),
     });
   }

   @Get('services/:serviceId')
   async getService(@Param('serviceId') serviceId: string, @Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_SERVICE_FETCHED',
       message: 'Service config fetched',
       requestId: getRequestId(req),
       data: await this.adminService.getService(serviceId),
     });
   }

  @Post('services')
  async createServiceConfig(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateServiceConfigDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_SERVICE_CREATED',
      message: 'Service config created',
      requestId: getRequestId(req),
      data: await this.adminService.createServiceConfig(
        user.userId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('services/:serviceId')
  async patchServiceConfig(
    @CurrentUser() user: AuthenticatedUser,
    @Param('serviceId') serviceId: string,
    @Body() body: UpdateServiceConfigDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_SERVICE_UPDATED',
      message: 'Service config updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchServiceConfig(
        user.userId,
        serviceId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }
}
