import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userType: string, userId: string) {
    return this.prisma.notification.findMany({
      where: { userType, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(userType: string, userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userType, userId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true, isRead: true },
    });
  }

  async markAllRead(userType: string, userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userType, userId, read: false },
      data: { read: true, isRead: true },
    });
    return { updated: result.count };
  }
}
