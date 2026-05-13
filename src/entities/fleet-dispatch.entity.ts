import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fleet_dispatches')
export class FleetDispatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fleet_id' })
  fleetId: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'enum', enum: ['pending', 'assigned', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @Column({ name: 'vehicle_id', nullable: true })
  vehicleId: string;

  @Column({ name: 'trip_id', nullable: true })
  tripId: string;

  @Column()
  pickup: string;

  @Column()
  dropoff: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
