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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto_1 = require("crypto");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const user_role_entity_1 = require("../entities/user-role.entity");
const redis_service_1 = require("../redis/redis.service");
const jwt_secret_1 = require("./jwt-secret");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepo, roleRepo, userRoleRepo, redis) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.userRoleRepo = userRoleRepo;
        this.redis = redis;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.JWT_SECRET = (0, jwt_secret_1.getJwtSecret)();
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
        this.REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    }
    async register(data) {
        const existing = await this.userRepo.findOne({ where: { email: data.email } });
        if (existing) {
            throw new common_1.ConflictException('EMAIL_ALREADY_EXISTS');
        }
        const allowedRegistrationRoles = new Set(['rider', 'driver', 'fleet_owner']);
        const requestedRole = data.roles?.find((role) => allowedRegistrationRoles.has(role));
        const defaultRoles = [requestedRole ?? 'rider'];
        const hashedPassword = await bcrypt.hash(data.password, 12);
        const user = this.userRepo.create({
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
            roles: defaultRoles,
        });
        await this.userRepo.save(user);
        for (const roleName of defaultRoles) {
            const role = await this.roleRepo.findOne({ where: { name: roleName } });
            if (role) {
                await this.userRoleRepo.save({ user, role });
            }
        }
        this.logger.log(`User registered: ${user.email} with roles [${defaultRoles.join(', ')}]`);
        return this.generateTokens(user);
    }
    async login(email, password) {
        const user = await this.userRepo.findOne({
            where: { email },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('INVALID_CREDENTIALS');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('INVALID_CREDENTIALS');
        }
        return this.generateTokens(user);
    }
    async refresh(refreshToken) {
        const userId = await this.redis.get(`refresh:${refreshToken}`);
        if (!userId) {
            throw new common_1.UnauthorizedException('INVALID_REFRESH_TOKEN');
        }
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('USER_NOT_FOUND');
        }
        await this.redis.del(`refresh:${refreshToken}`);
        return this.generateTokens(user);
    }
    async logout(refreshToken) {
        await this.redis.del(`refresh:${refreshToken}`);
    }
    async requestPasswordReset(email) {
        const user = await this.userRepo.findOne({ where: { email } });
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
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('USER_NOT_FOUND');
        }
        user.password = await bcrypt.hash(newPassword, 12);
        await this.userRepo.save(user);
        this.logger.log(`Password reset for ${email}`);
        return { reset: true };
    }
    async generateTokens(user) {
        const relationRoles = user.userRoles?.map((ur) => ur.role.name) ?? [];
        const roles = relationRoles.length ? relationRoles : (user.roles ?? []);
        const payload = { sub: user.id, email: user.email, roles };
        const accessToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
        const refreshToken = (0, crypto_1.randomBytes)(48).toString('hex');
        const refreshTtl = 7 * 24 * 60 * 60;
        await this.redis.set(`refresh:${refreshToken}`, user.id, refreshTtl);
        const userResponse = {
            id: user.id,
            email: user.email,
            phone: user.phone,
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
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map