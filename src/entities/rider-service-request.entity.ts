import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('rider_service_requests')
export class RiderServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rider_id' })
  riderId: string;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @Column({ type: 'enum', enum: ['rental', 'tour', 'ambulance'] })
  serviceType: 'rental' | 'tour' | 'ambulance';

  @Column({ type: 'varchar', length: 64 })
  status: string;

  @Column({ type: 'simple-json', default: {} })
  payload: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
