import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { UpdateAdminProfileDto } from './dto/admin.dto';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller('admins/me')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_PROFILE_FETCHED',
      message: 'Admin profile fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getProfile(user.userId),
    });
  }

  @Patch('profile')
  async patchProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateAdminProfileDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_PROFILE_UPDATED',
      message: 'Admin profile updated',
      requestId: getRequestId(req),
      data: await this.adminService.updateProfile(user.userId, body),
    });
  }
}
