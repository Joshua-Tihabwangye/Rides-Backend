"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const jwt_secret_1 = require("./jwt-secret");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.JWT_SECRET = (0, jwt_secret_1.getJwtSecret)();
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
        this.REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    }
    async register(data) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new common_1.ConflictException('EMAIL_ALREADY_EXISTS');
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
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { userRoles: { include: { role: true } } },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('INVALID_CREDENTIALS');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('INVALID_CREDENTIALS');
        }
        const roles = user.userRoles?.map((ur) => ur.role.name) || user.roles || [];
        return this.generateTokens(user.id, user.email, roles);
    }
    async refresh(refreshToken) {
        const userId = await this.redis.get(`refresh:${refreshToken}`);
        if (!userId) {
            throw new common_1.UnauthorizedException('INVALID_REFRESH_TOKEN');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { userRoles: { include: { role: true } } },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('USER_NOT_FOUND');
        }
        await this.redis.del(`refresh:${refreshToken}`);
        const roles = user.userRoles?.map((ur) => ur.role.name) || user.roles || [];
        return this.generateTokens(user.id, user.email, roles);
    }
    async logout(refreshToken) {
        await this.redis.del(`refresh:${refreshToken}`);
    }
    async requestPasswordReset(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { sent: true };
        }
        const otp = (0, crypto_1.randomInt)(100000, 1_000_000).toString();
        const key = `pwdreset:otp:${email}`;
        await this.redis.set(key, otp, 600);
        this.logger.log(`Password reset OTP generated for ${email}`);
        return { sent: true };
    }
    async verifyOtp(email, otp) {
        const key = `pwdreset:otp:${email}`;
        const storedOtp = await this.redis.get(key);
        if (!storedOtp || storedOtp !== otp) {
            throw new common_1.UnauthorizedException('INVALID_OTP');
        }
        return { verified: true, resetRequired: false };
    }
    async resetPassword(email, otp, newPassword) {
        const key = `pwdreset:otp:${email}`;
        const storedOtp = await this.redis.get(key);
        if (!storedOtp || storedOtp !== otp) {
            throw new common_1.UnauthorizedException('INVALID_OTP');
        }
        await this.redis.del(key);
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('USER_NOT_FOUND');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });
        this.logger.log(`Password reset for ${email}`);
        return { reset: true };
    }
    async generateTokens(userId, email, roles) {
        const payload = { sub: userId, email, roles };
        const accessToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
        const refreshToken = (0, crypto_1.randomBytes)(48).toString('hex');
        const refreshTtl = 7 * 24 * 60 * 60;
        await this.redis.set(`refresh:${refreshToken}`, userId, refreshTtl);
        const userResponse = {
            id: userId,
            email,
            roles,
        };
        return { accessToken, refreshToken, user: userResponse };
    }
    verifyAccessToken(token) {
        return jwt.verify(token, this.JWT_SECRET);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map