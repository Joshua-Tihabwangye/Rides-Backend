import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('fleet_payouts')
export class FleetPayout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fleet_id' })
  fleetId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'UGX' })
  currency: string;

  @Column({ type: 'enum', enum: ['pending', 'processing', 'paid'], default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
