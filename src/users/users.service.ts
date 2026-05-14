import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
      include: { userRoles: { include: { role: true } } },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone ?? '',
      roles: user.userRoles?.map((ur) => ur.role.name) || [],
      status: user.isActive ? 'active' : 'deleted',
    };
  }

  async patchMe(userId: string, patch: { email?: string; phone?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data: Record<string, unknown> = {};
    if (patch.email !== undefined) data.email = patch.email;
    if (patch.phone !== undefined) data.phone = patch.phone;

    await this.prisma.user.update({ where: { id: userId }, data });

    return this.getMe(userId);
  }

  async deleteMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({ where: { id: userId }, data: { isActive: false } });

    return { deleted: true };
  }
}
