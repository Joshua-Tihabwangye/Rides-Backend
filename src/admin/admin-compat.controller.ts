import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { ReviewApprovalDto, UpdateFeatureFlagDto } from './dto/admin.dto';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller('admin')
export class AdminCompatController {
  constructor(
    private readonly adminService: AdminService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('feature-flags')
  async getFeatureFlags(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_FLAGS_FETCHED',
      message: 'Feature flags fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getFlags(),
    });
  }

  @Patch('feature-flags/:flagKey')
  async patchFeatureFlag(
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

  @Get('audit-events')
  async getAuditEvents(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_AUDIT_LOG_FETCHED',
      message: 'Audit events fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getAuditLog(),
    });
  }

  @Get('risk-cases')
  async listRiskCases(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_RISK_CASES_FETCHED',
      message: 'Risk cases fetched',
      requestId: getRequestId(req),
      data: await this.adminService.listRiskCases(),
    });
  }

  @Get('risk-cases/:caseId')
  async getRiskCase(@Param('caseId') caseId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_RISK_CASE_FETCHED',
      message: 'Risk case fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getRiskCase(caseId),
    });
  }

  @Post('approvals/:approvalId/review')
  async reviewApprovalCompat(
    @CurrentUser() user: AuthenticatedUser,
    @Param('approvalId') approvalId: string,
    @Body() body: ReviewApprovalDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_APPROVAL_REVIEWED',
      message: 'Approval reviewed',
      requestId: getRequestId(req),
      data: await this.adminService.reviewApproval(
        user.userId,
        approvalId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }
}
