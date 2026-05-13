import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FleetPartnerProfile } from './fleet-partner-profile.entity';

@Entity('fleet_branches')
export class FleetBranch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fleet_partner_id' })
  fleetPartnerId: string;

  @Column({ name: 'fleet_id', nullable: true })
  fleetId: string;

  @ManyToOne(() => FleetPartnerProfile, fp => fp.branches)
  @JoinColumn({ name: 'fleet_partner_id' })
  fleetPartner: FleetPartnerProfile;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  managerName: string;

  @Column({ type: 'simple-json', default: {} })
  operatingHours: Record<string, any>;
}
