import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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

  @Get('finance/tax-config')
  async getTaxConfig(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_TAX_CONFIG_FETCHED',
      message: 'Tax config fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getTaxConfig(),
    });
  }

  @Patch('finance/tax-config/:regionId')
  async patchTaxConfig(
    @CurrentUser() user: AuthenticatedUser,
    @Param('regionId') regionId: string,
    @Body() body: Partial<{ currency: string; vatPercent: number; serviceTaxPercent: number; surchargePercent: number; notes: string }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_TAX_CONFIG_UPDATED',
      message: 'Tax config updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchTaxConfig(
        user.userId,
        regionId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Get('finance/invoice-templates')
  async getInvoiceTemplates(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_INVOICE_TEMPLATES_FETCHED',
      message: 'Invoice templates fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getInvoiceTemplates(),
    });
  }

  @Patch('finance/invoice-templates/:templateId')
  async patchInvoiceTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('templateId') templateId: string,
    @Body() body: Partial<{ regionId: string; templateName: string; prefix: string; nextNumber: number; footer: string }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_INVOICE_TEMPLATE_UPDATED',
      message: 'Invoice template updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchInvoiceTemplate(
        user.userId,
        templateId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Get('training/modules')
  async listTrainingModules(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_TRAINING_MODULES_FETCHED',
      message: 'Training modules fetched',
      requestId: getRequestId(req),
      data: await this.adminService.listTrainingModules(),
    });
  }

  @Post('training/modules')
  async createTrainingModule(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { title: string; category: string; status?: 'draft' | 'published' | 'archived'; content?: string },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_TRAINING_MODULE_CREATED',
      message: 'Training module created',
      requestId: getRequestId(req),
      data: await this.adminService.createTrainingModule(
        user.userId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('training/modules/:moduleId')
  async patchTrainingModule(
    @CurrentUser() user: AuthenticatedUser,
    @Param('moduleId') moduleId: string,
    @Body() body: Partial<{ title: string; category: string; status: 'draft' | 'published' | 'archived'; content: string }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_TRAINING_MODULE_UPDATED',
      message: 'Training module updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchTrainingModule(
        user.userId,
        moduleId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Delete('training/modules/:moduleId')
  async deleteTrainingModule(
    @CurrentUser() user: AuthenticatedUser,
    @Param('moduleId') moduleId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_TRAINING_MODULE_DELETED',
      message: 'Training module deleted',
      requestId: getRequestId(req),
      data: await this.adminService.deleteTrainingModule(
        user.userId,
        moduleId,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Get('policies')
  async listPolicies(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_POLICIES_FETCHED',
      message: 'Policies fetched',
      requestId: getRequestId(req),
      data: await this.adminService.listPolicies(),
    });
  }

  @Post('policies')
  async createPolicy(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { key: string; title: string; scope: 'global' | 'rider' | 'driver' | 'fleet' | 'admin'; status?: 'draft' | 'active' | 'archived'; content: string },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_POLICY_CREATED',
      message: 'Policy created',
      requestId: getRequestId(req),
      data: await this.adminService.createPolicy(
        user.userId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('policies/:policyId')
  async patchPolicy(
    @CurrentUser() user: AuthenticatedUser,
    @Param('policyId') policyId: string,
    @Body() body: Partial<{ key: string; title: string; scope: 'global' | 'rider' | 'driver' | 'fleet' | 'admin'; status: 'draft' | 'active' | 'archived'; content: string }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_POLICY_UPDATED',
      message: 'Policy updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchPolicy(
        user.userId,
        policyId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Get('vertical-policies')
  async listVerticalPolicies(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_VERTICAL_POLICIES_FETCHED',
      message: 'Vertical policies fetched',
      requestId: getRequestId(req),
      data: await this.adminService.listVerticalPolicies(),
    });
  }

  @Patch('vertical-policies/:verticalId')
  async patchVerticalPolicy(
    @CurrentUser() user: AuthenticatedUser,
    @Param('verticalId') verticalId: string,
    @Body() body: Partial<{ name: string; status: 'active' | 'inactive'; rules: Record<string, unknown> }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_VERTICAL_POLICY_UPDATED',
      message: 'Vertical policy updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchVerticalPolicy(
        user.userId,
        verticalId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }
}
