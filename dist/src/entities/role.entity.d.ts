import { UserRole } from './user-role.entity';
export declare class Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    userRoles: UserRole[];
}
