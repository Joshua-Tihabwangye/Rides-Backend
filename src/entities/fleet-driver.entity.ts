import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fleet_drivers')
export class FleetDriver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fleet_id' })
  fleetId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'driver_id' })
  driverId: string;

  @Column({ name: 'branch_id', nullable: true })
  branchId: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'enum', enum: ['invited', 'active', 'suspended'], default: 'invited' })
  status: string;

  @Column({ type: 'simple-array', default: '' })
  serviceModes: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
