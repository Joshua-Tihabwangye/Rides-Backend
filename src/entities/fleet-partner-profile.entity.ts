import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { FleetBranch } from './fleet-branch.entity';

@Entity('fleet_partner_profiles')
export class FleetPartnerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'fleet_id', unique: true, nullable: true })
  fleetId: string;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'suspended'], default: 'pending' })
  status: string;

  @Column({ type: 'simple-json', default: {} })
  verticals: Record<string, boolean>;

  @OneToMany(() => FleetBranch, branch => branch.fleetPartner)
  branches: FleetBranch[];
}
