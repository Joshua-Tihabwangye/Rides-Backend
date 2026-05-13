import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type TripStatus = 'requested' | 'driver_assigned' | 'driver_arriving' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
export type TripType = 'ride' | 'delivery' | 'rental' | 'tour' | 'ambulance' | 'school';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rider_id' })
  riderId: string;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @Column({ name: 'fleet_partner_id', nullable: true })
  fleetPartnerId: string;

  @Column({ name: 'fleet_id', nullable: true })
  fleetId: string;

  @Column({ type: 'enum', enum: ['ride', 'delivery', 'rental', 'tour', 'ambulance', 'school'], default: 'ride' })
  type: TripType;

  @Column({ type: 'enum', enum: ['requested', 'driver_assigned', 'driver_arriving', 'arrived', 'in_progress', 'completed', 'cancelled'], default: 'requested' })
  status: TripStatus;

  @Column({ type: 'simple-json' })
  pickupLocation: { lat: number; lng: number };

  @Column({ type: 'simple-json' })
  dropoffLocation: { lat: number; lng: number };

  @Column({ nullable: true })
  pickup: string;

  @Column({ nullable: true })
  dropoff: string;

  @Column()
  pickupAddress: string;

  @Column()
  dropoffAddress: string;

  @Column({ type: 'simple-json', nullable: true })
  route: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  driverEarnings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  platformFee: number;

  @Column({ type: 'simple-json', nullable: true })
  payment: Record<string, any>;

  @Column({ nullable: true })
  otpCode: string;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'simple-json', nullable: true })
  cancellationReason: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  rating: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  driverArrivedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
