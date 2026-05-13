import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import {
  AdminAnalyticsQueryDto,
  CreateAdminCompanyDto,
  ReviewApprovalDto,
  UpdateAdminCompanyDto,
} from './dto/admin.dto';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller('admin')
export class AdminOperationsController {
  constructor(
    private readonly adminService: AdminService,
    private readonly apiResponse: ApiResponseService,
  ) {}

   @Get('companies')
   async listCompanies(@Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_COMPANIES_FETCHED',
       message: 'Companies fetched',
       requestId: getRequestId(req),
       data: await this.adminService.listCompanies(),
     });
   }

   @Get('companies/:companyId')
   async getCompany(@Param('companyId') companyId: string, @Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_COMPANY_FETCHED',
       message: 'Company fetched',
       requestId: getRequestId(req),
       data: await this.adminService.getCompany(companyId),
     });
   }

  @Post('companies')
  async createCompany(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateAdminCompanyDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_COMPANY_CREATED',
      message: 'Company created',
      requestId: getRequestId(req),
      data: await this.adminService.createCompany(
        user.userId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('companies/:companyId')
  async patchCompany(
    @CurrentUser() user: AuthenticatedUser,
    @Param('companyId') companyId: string,
    @Body() body: UpdateAdminCompanyDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_COMPANY_UPDATED',
      message: 'Company updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchCompany(
        user.userId,
        companyId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

   @Get('approvals')
   async listApprovals(@Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_APPROVALS_FETCHED',
       message: 'Approvals fetched',
       requestId: getRequestId(req),
       data: await this.adminService.listApprovals(),
     });
   }

   @Get('approvals/:approvalId')
   async getApproval(@Param('approvalId') approvalId: string, @Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_APPROVAL_FETCHED',
       message: 'Approval fetched',
       requestId: getRequestId(req),
       data: await this.adminService.getApproval(approvalId),
     });
   }

  @Patch('approvals/:approvalId')
  async reviewApproval(
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

  @Get('analytics/operations')
  async getOperationsAnalytics(@Query() query: AdminAnalyticsQueryDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_ANALYTICS_OPERATIONS_FETCHED',
      message: 'Operations analytics fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getOperationsAnalytics(query.period),
    });
  }

  @Get('analytics/finance')
  async getFinanceAnalytics(@Query() query: AdminAnalyticsQueryDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_ANALYTICS_FINANCE_FETCHED',
      message: 'Finance analytics fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getFinanceAnalytics(query.period),
    });
  }

  @Get('safety/incidents')
  async listSafetyIncidents(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_SAFETY_INCIDENTS_FETCHED',
      message: 'Safety incidents fetched',
      requestId: getRequestId(req),
      data: await this.adminService.listSafetyIncidents(),
    });
  }

   @Get('risk/cases')
   async listRiskCases(@Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_RISK_CASES_FETCHED',
       message: 'Risk cases fetched',
       requestId: getRequestId(req),
       data: await this.adminService.listRiskCases(),
     });
   }

  @Get('risk/cases/:caseId')
  async getRiskCase(@Param('caseId') caseId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_RISK_CASE_FETCHED',
      message: 'Risk case fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getRiskCase(caseId),
    });
  }

  @Get('rider-services')
  async listRiderServiceRequests(
    @Query('serviceType') serviceType: 'rental' | 'tour' | 'ambulance' | undefined,
    @Query('status') status: string | undefined,
    @Query('riderId') riderId: string | undefined,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_RIDER_SERVICES_FETCHED',
      message: 'Rider service requests fetched',
      requestId: getRequestId(req),
      data: await this.adminService.listRiderServiceRequests({ serviceType, status, riderId }),
    });
  }

  @Get('rider-services/:requestId')
  async getRiderServiceRequest(@Param('requestId') requestId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_RIDER_SERVICE_FETCHED',
      message: 'Rider service request fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getRiderServiceRequest(requestId),
    });
  }

  @Get('agents')
  async listAgents(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_AGENTS_FETCHED',
      message: 'Agents fetched',
      requestId: getRequestId(req),
      data: await this.adminService.listAgents(),
    });
  }

  @Get('agents/:agentId')
  async getAgent(@Param('agentId') agentId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_AGENT_FETCHED',
      message: 'Agent fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getAgent(agentId),
    });
  }

  @Post('agents')
  async createAgent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { name: string; email: string; role: string; region?: string; status?: 'active' | 'inactive'; metadata?: Record<string, unknown> },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_AGENT_CREATED',
      message: 'Agent created',
      requestId: getRequestId(req),
      data: await this.adminService.createAgent(
        user.userId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('agents/:agentId')
  async patchAgent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('agentId') agentId: string,
    @Body() body: Partial<{ name: string; email: string; role: string; region: string; status: 'active' | 'inactive'; metadata: Record<string, unknown> }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_AGENT_UPDATED',
      message: 'Agent updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchAgent(
        user.userId,
        agentId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Delete('agents/:agentId')
  async deleteAgent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('agentId') agentId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_AGENT_DELETED',
      message: 'Agent deleted',
      requestId: getRequestId(req),
      data: await this.adminService.deleteAgent(
        user.userId,
        agentId,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Get('search')
  async search(@Query('query') query: string | undefined, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_SEARCH_RESULTS',
      message: 'Admin search completed',
      requestId: getRequestId(req),
      data: await this.adminService.searchAdmin(query ?? ''),
    });
  }
}
