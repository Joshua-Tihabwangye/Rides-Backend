import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fleet_services')
export class FleetServiceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fleet_id' })
  fleetId: string;

  @Column({ type: 'enum', enum: ['rental', 'tour', 'school_shuttle'] })
  service: string;

  @Column({ type: 'enum', enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ name: 'customer_name' })
  customerName: string;

  @Column({ name: 'asset_id', nullable: true })
  assetId: string;

  @Column({ type: 'bigint' })
  scheduledAt: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
