export type ScopedUserType = 'driver' | 'rider' | 'fleet' | 'admin';
export declare function normalizeUserTypePath(value: string): ScopedUserType;
export declare function assertUserScopeAccess(roles: string[], scope: ScopedUserType): void;
