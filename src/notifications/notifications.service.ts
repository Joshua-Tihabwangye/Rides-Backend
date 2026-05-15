import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { KafkaTopics } from '../kafka/kafka.topics';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly kafka?: KafkaProducerService,
  ) {}

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
    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true, isRead: true },
    });
    this.kafka?.emit(KafkaTopics.NOTIFICATIONS, 'notification.read', {
      notificationId,
      userId,
      userType,
    }, { userId });
    return updated;
  }

  async markAllRead(userType: string, userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userType, userId, read: false },
      data: { read: true, isRead: true },
    });
    this.kafka?.emit(KafkaTopics.NOTIFICATIONS, 'notification.all_read', {
      userId,
      userType,
      count: result.count,
    }, { userId });
    return { updated: result.count };
  }
}
