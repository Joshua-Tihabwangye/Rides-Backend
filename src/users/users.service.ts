import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getMe(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: ['userRoles', 'userRoles.role'],
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
    const user = await this.userRepository.findOne({ where: { id: userId, isActive: true } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (patch.email !== undefined) {
      user.email = patch.email;
    }
    if (patch.phone !== undefined) {
      user.phone = patch.phone;
    }

    await this.userRepository.save(user);

    return this.getMe(userId);
  }

  async deleteMe(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId, isActive: true } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = false;
    await this.userRepository.save(user);

    return { deleted: true };
  }
}
