import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fleet_training_courses')
export class FleetTrainingCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fleet_id' })
  fleetId: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: string;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
