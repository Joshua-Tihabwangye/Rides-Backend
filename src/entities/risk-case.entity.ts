import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('risk_cases')
export class RiskCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  severity: string;

  @Column({ type: 'enum', enum: ['open', 'monitoring', 'resolved'], default: 'open' })
  status: string;

  @Column({ name: 'subject_type', type: 'enum', enum: ['rider', 'driver', 'fleet', 'trip'] })
  subjectType: string;

  @Column({ name: 'subject_id' })
  subjectId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
