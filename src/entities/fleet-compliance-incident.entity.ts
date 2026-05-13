import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fleet_compliance_incidents')
export class FleetComplianceIncident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fleet_id' })
  fleetId: string;

  @Column()
  category: string;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  severity: string;

  @Column({ type: 'enum', enum: ['open', 'investigating', 'resolved'], default: 'open' })
  status: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
