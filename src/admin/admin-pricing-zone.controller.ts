import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { PricingZoneService } from '../pricing-zone/pricing-zone.service';
import { CreatePricingZoneDto, UpdatePricingZoneDto } from '../admin/dto/admin.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller('admin/pricing-zones')
export class AdminPricingZoneController {
  constructor(
    private readonly pricingZoneService: PricingZoneService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  async listZones(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'PRICING_ZONES_FETCHED',
      message: 'Pricing zones fetched',
      requestId: getRequestId(req),
      data: await this.pricingZoneService.listZones(),
    });
  }

  @Get(':zoneId')
  async getZone(@Param('zoneId') zoneId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'PRICING_ZONE_FETCHED',
      message: 'Pricing zone fetched',
      requestId: getRequestId(req),
      data: await this.pricingZoneService.getZone(zoneId),
    });
  }

  @Post()
  async createZone(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreatePricingZoneDto,
    @Req() req: Request,
  ) {
    const zone = await this.pricingZoneService.createZone({
      name: body.name,
      description: body.description,
      boundaries: body.boundaries as any,
      pricingRules: body.pricingRules,
      status: body.status,
    });
    // TODO: audit logging - could be added in service
    return this.apiResponse.success({
      code: 'PRICING_ZONE_CREATED',
      message: 'Pricing zone created',
      requestId: getRequestId(req),
      data: zone,
    });
  }

  @Patch(':zoneId')
  async updateZone(
    @CurrentUser() user: AuthenticatedUser,
    @Param('zoneId') zoneId: string,
    @Body() body: UpdatePricingZoneDto,
    @Req() req: Request,
  ) {
    const zone = await this.pricingZoneService.patchZone(zoneId, {
      name: body.name,
      description: body.description,
      boundaries: body.boundaries as any,
      pricingRules: body.pricingRules,
      status: body.status,
    });
    // TODO: audit
    return this.apiResponse.success({
      code: 'PRICING_ZONE_UPDATED',
      message: 'Pricing zone updated',
      requestId: getRequestId(req),
      data: zone,
    });
  }
}
