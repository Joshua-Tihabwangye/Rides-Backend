"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUserTypePath = normalizeUserTypePath;
exports.assertUserScopeAccess = assertUserScopeAccess;
const common_1 = require("@nestjs/common");
const USER_TYPE_MAP = {
    drivers: 'driver',
    riders: 'rider',
    fleet: 'fleet',
    admins: 'admin',
};
const USER_TYPE_ROLES = {
    driver: ['driver'],
    rider: ['rider'],
    fleet: ['fleet_owner', 'fleet_manager', 'fleet_dispatcher', 'fleet_finance'],
    admin: ['admin', 'super_admin'],
};
function normalizeUserTypePath(value) {
    const normalized = USER_TYPE_MAP[value.trim().toLowerCase()];
    if (!normalized) {
        throw new common_1.BadRequestException(`Unsupported user type: ${value}`);
    }
    return normalized;
}
function assertUserScopeAccess(roles, scope) {
    const allowedRoles = USER_TYPE_ROLES[scope];
    if (!allowedRoles.some((role) => roles.includes(role))) {
        throw new common_1.ForbiddenException(`You are not allowed to access ${scope} resources.`);
    }
}
//# sourceMappingURL=user-scope.js.map