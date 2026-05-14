import { Injectable, UnauthorizedException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { randomBytes, randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { getJwtSecret } from './jwt-secret';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly JWT_SECRET = getJwtSecret();
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  private readonly REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  constructor(
    private readonly prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async register(data: {
    email: string;
    password: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    roles?: Array<'rider' | 'driver' | 'fleet_owner'>;
  }): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ConflictException('EMAIL_ALREADY_EXISTS');
    }

    const allowedRegistrationRoles = new Set(['rider', 'driver', 'fleet_owner']);
    const requestedRole = data.roles?.find((role) => allowedRegistrationRoles.has(role));
    const defaultRoles = [requestedRole ?? 'rider'];

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        roles: defaultRoles,
      },
    });

    for (const roleName of defaultRoles) {
      const role = await this.prisma.role.findUnique({ where: { name: roleName } });
      if (role) {
        await this.prisma.userRole.create({
          data: { userId: user.id, roleId: role.id },
        });
      }
    }

    this.logger.log(`User registered: ${user.email} with roles [${defaultRoles.join(', ')}]`);
    return this.generateTokens(user.id, user.email, defaultRoles);
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const roles = user.userRoles?.map((ur) => ur.role.name) || user.roles || [];
    return this.generateTokens(user.id, user.email, roles);
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const userId = await this.redis.get(`refresh:${refreshToken}`);
    if (!userId) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }

    await this.redis.del(`refresh:${refreshToken}`);
    const roles = user.userRoles?.map((ur) => ur.role.name) || user.roles || [];
    return this.generateTokens(user.id, user.email, roles);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.redis.del(`refresh:${refreshToken}`);
  }

  async requestPasswordReset(email: string): Promise<{ sent: boolean }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { sent: true };
    }

    const otp = randomInt(100000, 1_000_000).toString();
    const key = `pwdreset:otp:${email}`;
    await this.redis.set(key, otp, 600);

    this.logger.log(`Password reset OTP generated for ${email}`);

    return { sent: true };
  }

  async verifyOtp(email: string, otp: string): Promise<{ verified: boolean; resetRequired?: boolean }> {
    const key = `pwdreset:otp:${email}`;
    const storedOtp = await this.redis.get(key);
    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('INVALID_OTP');
    }
    // Do not delete OTP here; allow reset to consume it
    return { verified: true, resetRequired: false };
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ reset: boolean }> {
    const key = `pwdreset:otp:${email}`;
    const storedOtp = await this.redis.get(key);
    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('INVALID_OTP');
    }
    // OTP valid, consume it
    await this.redis.del(key);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });

    this.logger.log(`Password reset for ${email}`);

    return { reset: true };
  }

  private async generateTokens(userId: string, email: string, roles: string[]): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const payload = { sub: userId, email, roles };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN as any });
    const refreshToken = randomBytes(48).toString('hex');

    const refreshTtl = 7 * 24 * 60 * 60; // 7 days
    await this.redis.set(`refresh:${refreshToken}`, userId, refreshTtl);

    const userResponse = {
      id: userId,
      email,
      roles,
    };

    return { accessToken, refreshToken, user: userResponse };
  }

  verifyAccessToken(token: string): { sub: string; email: string; roles: string[] } {
    return jwt.verify(token, this.JWT_SECRET) as any;
  }
}
