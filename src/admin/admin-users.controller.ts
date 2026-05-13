import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import {
  CreateAdminRoleDto,
  CreateAdminUserDto,
  UpdateAdminRoleDto,
  UpdateAdminUserDto,
} from './dto/admin.dto';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller('admin')
export class AdminUsersController {
  constructor(
    private readonly adminService: AdminService,
    private readonly apiResponse: ApiResponseService,
  ) {}

   @Get('riders')
   async listRiders(@Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_RIDERS_FETCHED',
       message: 'Riders fetched',
       requestId: getRequestId(req),
       data: await this.adminService.listRiders(),
     });
   }

   @Get('riders/:riderId')
   async getRider(@Param('riderId') riderId: string, @Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_RIDER_FETCHED',
       message: 'Rider fetched',
       requestId: getRequestId(req),
       data: await this.adminService.getRider(riderId),
     });
   }

  @Post('riders')
  async createRider(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateAdminUserDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_RIDER_CREATED',
      message: 'Rider created',
      requestId: getRequestId(req),
      data: await this.adminService.createRider(
        user.userId,
        { email: body.email, phone: body.phone, fullName: body.fullName, city: body.city, country: body.country },
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('riders/:riderId')
  async patchRider(
    @CurrentUser() user: AuthenticatedUser,
    @Param('riderId') riderId: string,
    @Body() body: UpdateAdminUserDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_RIDER_UPDATED',
      message: 'Rider updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchRider(
        user.userId,
        riderId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

   @Get('drivers')
   async listDrivers(@Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_DRIVERS_FETCHED',
       message: 'Drivers fetched',
       requestId: getRequestId(req),
       data: await this.adminService.listDrivers(),
     });
   }

   @Get('drivers/:driverId')
   async getDriver(@Param('driverId') driverId: string, @Req() req: Request) {
     return this.apiResponse.success({
       code: 'ADMIN_DRIVER_FETCHED',
       message: 'Driver fetched',
       requestId: getRequestId(req),
       data: await this.adminService.getDriver(driverId),
     });
   }

  @Post('drivers')
  async createDriver(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateAdminUserDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_DRIVER_CREATED',
      message: 'Driver created',
      requestId: getRequestId(req),
      data: await this.adminService.createDriver(
        user.userId,
        { email: body.email, phone: body.phone, fullName: body.fullName, city: body.city, country: body.country },
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('drivers/:driverId')
  async patchDriver(
    @CurrentUser() user: AuthenticatedUser,
    @Param('driverId') driverId: string,
    @Body() body: UpdateAdminUserDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_DRIVER_UPDATED',
      message: 'Driver updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchDriver(
        user.userId,
        driverId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Get('users')
  async listUsers(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_USERS_FETCHED',
      message: 'Users fetched',
      requestId: getRequestId(req),
      data: await this.adminService.listUsers(),
    });
  }

  @Post('users')
  async createUser(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateAdminUserDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_USER_CREATED',
      message: 'User created',
      requestId: getRequestId(req),
      data: await this.adminService.createUser(
        user.userId,
        { ...body, roles: body.roles ?? ['rider'] },
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('users/:userId')
  async patchUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
    @Body() body: UpdateAdminUserDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_USER_UPDATED',
      message: 'User updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchUser(
        user.userId,
        targetUserId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Get('roles')
  async listRoles(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_ROLES_FETCHED',
      message: 'Roles fetched',
      requestId: getRequestId(req),
      data: await this.adminService.listRoles(),
    });
  }

  @Get('roles/:roleId')
  async getRole(@Param('roleId') roleId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'ADMIN_ROLE_FETCHED',
      message: 'Role fetched',
      requestId: getRequestId(req),
      data: await this.adminService.getRole(roleId),
    });
  }

  @Post('roles')
  async createRole(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateAdminRoleDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_ROLE_CREATED',
      message: 'Role created',
      requestId: getRequestId(req),
      data: await this.adminService.createRole(
        user.userId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }

  @Patch('roles/:roleId')
  async patchRole(
    @CurrentUser() user: AuthenticatedUser,
    @Param('roleId') roleId: string,
    @Body() body: UpdateAdminRoleDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'ADMIN_ROLE_UPDATED',
      message: 'Role updated',
      requestId: getRequestId(req),
      data: await this.adminService.patchRole(
        user.userId,
        roleId,
        body,
        { ipAddress: req.ip, userAgent: req.headers['user-agent'] },
      ),
    });
  }
}
