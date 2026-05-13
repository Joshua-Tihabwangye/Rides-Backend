"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const auth_service_1 = require("../src/auth/auth.service");
class RedisMock {
    constructor() {
        this.store = new Map();
    }
    async get(key) {
        return this.store.get(key) ?? null;
    }
    async set(key, value) {
        this.store.set(key, value);
    }
    async del(key) {
        this.store.delete(key);
    }
}
describe('AuthService', () => {
    it('register/login return JWTs and refresh rotates token, logout invalidates token', async () => {
        const usersByEmail = new Map();
        const usersById = new Map();
        const userRepo = {
            findOne: jest.fn(async (args) => {
                const email = args?.where?.email;
                const id = args?.where?.id;
                if (email)
                    return usersByEmail.get(email) ?? null;
                if (id)
                    return usersById.get(id) ?? null;
                return null;
            }),
            create: jest.fn((data) => ({ ...data })),
            save: jest.fn(async (user) => {
                if (!user.id) {
                    user.id = 'usr-001';
                }
                usersByEmail.set(user.email, user);
                usersById.set(user.id, user);
                return user;
            }),
        };
        const roleRepo = {
            findOne: jest.fn(async ({ where: { name } }) => ({ id: `role-${name}`, name })),
        };
        const userRoleRepo = {
            save: jest.fn(async () => null),
        };
        const redis = new RedisMock();
        const service = new auth_service_1.AuthService(userRepo, roleRepo, userRoleRepo, redis);
        const registerRes = await service.register({
            email: 'auth-test@example.com',
            password: 'Password123!',
            roles: ['driver'],
        });
        expect(typeof registerRes.accessToken).toBe('string');
        expect(typeof registerRes.refreshToken).toBe('string');
        expect(registerRes.refreshToken.length).toBeGreaterThan(20);
        const storedUser = usersByEmail.get('auth-test@example.com');
        expect(storedUser).toBeDefined();
        expect(await bcrypt.compare('Password123!', storedUser.password)).toBe(true);
        storedUser.userRoles = [{ role: { name: 'driver' } }];
        usersByEmail.set(storedUser.email, storedUser);
        usersById.set(storedUser.id, storedUser);
        const loginRes = await service.login('auth-test@example.com', 'Password123!');
        expect(typeof loginRes.accessToken).toBe('string');
        expect(typeof loginRes.refreshToken).toBe('string');
        expect(loginRes.user.roles).toEqual(['driver']);
        const oldRefresh = loginRes.refreshToken;
        expect(await redis.get(`refresh:${oldRefresh}`)).toBe(storedUser.id);
        const refreshRes = await service.refresh(oldRefresh);
        expect(typeof refreshRes.accessToken).toBe('string');
        expect(typeof refreshRes.refreshToken).toBe('string');
        expect(refreshRes.refreshToken).not.toBe(oldRefresh);
        expect(await redis.get(`refresh:${oldRefresh}`)).toBeNull();
        expect(await redis.get(`refresh:${refreshRes.refreshToken}`)).toBe(storedUser.id);
        await service.logout(refreshRes.refreshToken);
        expect(await redis.get(`refresh:${refreshRes.refreshToken}`)).toBeNull();
    });
});
//# sourceMappingURL=auth.service.spec.js.map