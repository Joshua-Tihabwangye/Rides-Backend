import { BadRequestException, ForbiddenException } from '@nestjs/common';

export type ScopedUserType = 'driver' | 'rider' | 'fleet' | 'admin';

const USER_TYPE_MAP: Record<string, ScopedUserType> = {
  drivers: 'driver',
  riders: 'rider',
  fleet: 'fleet',
  admins: 'admin',
};

const USER_TYPE_ROLES: Record<ScopedUserType, string[]> = {
  driver: ['driver'],
  rider: ['rider'],
  fleet: ['fleet_owner', 'fleet_manager', 'fleet_dispatcher', 'fleet_finance'],
  admin: ['admin', 'super_admin'],
};

export function normalizeUserTypePath(value: string): ScopedUserType {
  const normalized = USER_TYPE_MAP[value.trim().toLowerCase()];
  if (!normalized) {
    throw new BadRequestException(`Unsupported user type: ${value}`);
  }
  return normalized;
}

export function assertUserScopeAccess(roles: string[], scope: ScopedUserType) {
  const allowedRoles = USER_TYPE_ROLES[scope];
  if (!allowedRoles.some((role) => roles.includes(role))) {
    throw new ForbiddenException(`You are not allowed to access ${scope} resources.`);
  }
}
