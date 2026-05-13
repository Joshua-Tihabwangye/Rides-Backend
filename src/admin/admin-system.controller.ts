import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { UpdateFeatureFlagDto } from './dto/admin.dto';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller('admin/system')
export class AdminSystemController {
  constructor(
    private readonly adminService: AdminService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('audit-log')
  async getAuditLog(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_AUDIT_LOG_FETCHED',
      message: 'Audit log fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getAuditLog(),
    });
  }

  @Get('flags')
  async getFlags(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_FLAGS_FETCHED',
      message: 'Feature flags fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getFlags(),
    });
  }

  @Patch('flags/:flagKey')
  async patchFlag(
    @CurrentUser() user: AuthenticatedUser,
    @Param('flagKey') flagKey: string,
    @Body() body: UpdateFeatureFlagDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_FLAG_UPDATED',
      message: 'Feature flag updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchFeatureFlag(
        user.userId,
        flagKey,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Get('health')
  async getHealth(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_SYSTEM_HEALTH_FETCHED',
      message: 'System health fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getHealth(),
    });
  }

  @Get('overview')
  async getOverview(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_SYSTEM_OVERVIEW_FETCHED',
      message: 'System overview fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getOverview(),
    });
  }
}
