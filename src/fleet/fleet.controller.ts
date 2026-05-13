import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { PatchFleetBranchDto, UpdateFleetProfileDto, UpsertFleetBranchDto } from './dto/fleet.dto';
import { FleetService } from './fleet.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('fleet_owner', 'fleet_manager', 'fleet_dispatcher', 'fleet_finance')
@Controller('fleet/me')
export class FleetController {
  constructor(
    private readonly fleetService: FleetService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_PROFILE_FETCHED',
      message: 'Fleet profile fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getProfile(user.userId),
    });
  }

  @Patch('profile')
  async patchProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateFleetProfileDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_PROFILE_UPDATED',
      message: 'Fleet profile updated',
      requestId: getRequestId(req),
      data: await this.fleetService.updateProfile(user.userId, body),
    });
  }

  @Get('branches')
  async listBranches(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_BRANCHES_FETCHED',
      message: 'Fleet branches fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listBranches(user.userId),
    });
  }

  @Get('branches/:branchId')
  async getBranchById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('branchId') branchId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_BRANCH_FETCHED',
      message: 'Fleet branch fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getBranchById(user.userId, branchId),
    });
  }

  @Post('branches')
  async createBranch(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpsertFleetBranchDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_BRANCH_CREATED',
      message: 'Fleet branch created',
      requestId: getRequestId(req),
      data: await this.fleetService.createBranch(user.userId, body),
    });
  }

  @Patch('branches/:branchId')
  async patchBranch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('branchId') branchId: string,
    @Body() body: PatchFleetBranchDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_BRANCH_UPDATED',
      message: 'Fleet branch updated',
      requestId: getRequestId(req),
      data: await this.fleetService.patchBranch(user.userId, branchId, body),
    });
  }

  @Delete('branches/:branchId')
  async deleteBranch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('branchId') branchId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_BRANCH_DELETED',
      message: 'Fleet branch deleted',
      requestId: getRequestId(req),
      data: await this.fleetService.deleteBranch(user.userId, branchId),
    });
  }
}
