import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        phone: string;
        roles: string[];
        status: string;
    }>;
    patchMe(userId: string, patch: {
        email?: string;
        phone?: string;
    }): Promise<{
        id: string;
        email: string;
        phone: string;
        roles: string[];
        status: string;
    }>;
    deleteMe(userId: string): Promise<{
        deleted: boolean;
    }>;
}
