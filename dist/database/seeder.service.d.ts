import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
export declare class SeederService implements OnModuleInit {
    private roleRepo;
    private readonly logger;
    constructor(roleRepo: Repository<Role>);
    onModuleInit(): Promise<void>;
    private seedRoles;
}
