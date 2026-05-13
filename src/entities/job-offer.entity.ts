import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('job_offers')
export class JobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_id' })
  tripId: string;

  @Column({ name: 'driver_id' })
  driverId: string;

  @Column({ name: 'rider_id', nullable: true })
  riderId: string;

  @Column({ type: 'enum', enum: ['pending', 'offered', 'accepted', 'rejected', 'cancelled', 'expired'], default: 'pending' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ nullable: true })
  pickup: string;

  @Column({ nullable: true })
  dropoff: string;

  @Column({ type: 'simple-json', nullable: true })
  pickupLocation: { lat: number; lng: number };

  @Column({ type: 'simple-json', nullable: true })
  dropoffLocation: { lat: number; lng: number };

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedFare: number;

  @Column({ type: 'simple-json', nullable: true })
  route: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
