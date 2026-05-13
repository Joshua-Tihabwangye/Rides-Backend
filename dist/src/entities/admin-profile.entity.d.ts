import { User } from './user.entity';
export declare class AdminProfile {
    id: string;
    userId: string;
    user: User;
    firstName: string;
    lastName: string;
    department: string;
    permissions: Record<string, any>;
}
