import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notificationRepo: Repository<Notification>,
  ) {}

  async list(userType: string, userId: string) {
    return this.notificationRepo.find({
      where: { userType, userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markRead(userType: string, userId: string, notificationId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId, userType, userId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.read = true;
    return this.notificationRepo.save(notification);
  }

  async markAllRead(userType: string, userId: string) {
    const result = await this.notificationRepo.update(
      { userType, userId, read: false },
      { read: true },
    );
    return { updated: result.affected ?? 0 };
  }
}
