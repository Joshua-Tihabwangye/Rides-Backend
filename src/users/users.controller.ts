import { Body, Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('me')
  async getMe(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'USER_FETCHED',
      message: 'User fetched',
      requestId: getRequestId(req),
      data: await this.usersService.getMe(user.userId),
    });
  }

  @Patch('me')
  async patchMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'USER_UPDATED',
      message: 'User updated',
      requestId: getRequestId(req),
      data: await this.usersService.patchMe(user.userId, body),
    });
  }

  @Delete('me')
  async deleteMe(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'USER_DELETED',
      message: 'User deleted',
      requestId: getRequestId(req),
      data: await this.usersService.deleteMe(user.userId),
    });
  }
}
