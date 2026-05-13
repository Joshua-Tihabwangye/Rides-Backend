import { UserRole } from './user-role.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    phone: string;
    status: string;
    roles: string[];
    isActive: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    driverId: string;
    riderId: string;
    fleetId: string;
    adminId: string;
    createdAt: Date;
    updatedAt: Date;
    userRoles: UserRole[];
}
