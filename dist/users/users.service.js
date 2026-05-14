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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, isActive: true },
            include: { userRoles: { include: { role: true } } },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            phone: user.phone ?? '',
            roles: user.userRoles?.map((ur) => ur.role.name) || [],
            status: user.isActive ? 'active' : 'deleted',
        };
    }
    async patchMe(userId, patch) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, isActive: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const data = {};
        if (patch.email !== undefined)
            data.email = patch.email;
        if (patch.phone !== undefined)
            data.phone = patch.phone;
        await this.prisma.user.update({ where: { id: userId }, data });
        return this.getMe(userId);
    }
    async deleteMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, isActive: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({ where: { id: userId }, data: { isActive: false } });
        return { deleted: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map