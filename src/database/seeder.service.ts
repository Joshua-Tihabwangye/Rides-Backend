import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const defaultRoles = [
      { name: 'rider', description: 'App user who requests rides/deliveries', permissions: [] },
      { name: 'driver', description: 'Driver who accepts and completes trips', permissions: [] },
      { name: 'fleet_owner', description: 'Fleet company owner', permissions: ['fleet.manage'] },
      { name: 'fleet_manager', description: 'Fleet manager', permissions: ['fleet.manage'] },
      { name: 'fleet_dispatcher', description: 'Fleet dispatcher', permissions: ['fleet.dispatch'] },
      { name: 'fleet_finance', description: 'Fleet finance officer', permissions: ['fleet.earnings'] },
      { name: 'admin', description: 'Platform administrator', permissions: ['admin.read', 'admin.write'] },
      { name: 'super_admin', description: 'Super administrator', permissions: ['admin.*'] },
    ];

    for (const roleData of defaultRoles) {
      const exists = await this.roleRepo.findOne({ where: { name: roleData.name } });
      if (!exists) {
        await this.roleRepo.save(this.roleRepo.create(roleData));
        this.logger.log(`Seeded role: ${roleData.name}`);
      }
    }
  }
}
