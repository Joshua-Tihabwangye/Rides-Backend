import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('safety_events')
export class SafetyEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'driver_id' })
  driverId: string;

  @Column({ name: 'trip_id' })
  tripId: string;

  @Column({ type: 'enum', enum: ['temporary_stop', 'safety_check', 'sos'] })
  type: string;

  @Column({ type: 'simple-json', nullable: true })
  payload: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
