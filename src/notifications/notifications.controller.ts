import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import { assertUserScopeAccess, normalizeUserTypePath } from '../common/utils/user-scope';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get(':userType/me/notifications')
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userType') userTypeParam: string,
    @Req() req: Request,
  ) {
    const userType = normalizeUserTypePath(userTypeParam);
    assertUserScopeAccess(user.roles, userType);
    return this.apiResponse.success({
      code: 'NOTIFICATIONS_FETCHED',
      message: 'Notifications fetched',
      requestId: getRequestId(req),
      data: await this.notificationsService.list(userType, user.userId),
    });
  }

  @Patch(':userType/me/notifications/:notificationId/read')
  async markRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userType') userTypeParam: string,
    @Param('notificationId') notificationId: string,
    @Req() req: Request,
  ) {
    const userType = normalizeUserTypePath(userTypeParam);
    assertUserScopeAccess(user.roles, userType);
    return this.apiResponse.success({
      code: 'NOTIFICATION_READ',
      message: 'Notification marked as read',
      requestId: getRequestId(req),
      data: await this.notificationsService.markRead(userType, user.userId, notificationId),
    });
  }

  @Patch(':userType/me/notifications/read-all')
  async markAllRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userType') userTypeParam: string,
    @Req() req: Request,
  ) {
    const userType = normalizeUserTypePath(userTypeParam);
    assertUserScopeAccess(user.roles, userType);
    return this.apiResponse.success({
      code: 'NOTIFICATIONS_READ_ALL',
      message: 'All notifications marked as read',
      requestId: getRequestId(req),
      data: await this.notificationsService.markAllRead(userType, user.userId),
    });
  }
}
