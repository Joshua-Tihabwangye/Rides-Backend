import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Point } from 'geojson';
import { User } from './user.entity';

@Entity('driver_profiles')
export class DriverProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'driver_id', unique: true, nullable: true })
  driverId: string;

  @Column({ name: 'fleet_id', nullable: true })
  fleetId: string;

  @Column({ name: 'branch_id', nullable: true })
  branchId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  driverLicenseNumber: string;

  @Column({ type: 'enum', enum: ['ride_only', 'delivery_only', 'dual_mode', 'rental', 'tour', 'ambulance', 'school'], default: 'dual_mode' })
  serviceMode: string;

  @Column({ type: 'simple-json', default: {} })
  preferences: Record<string, any>;

  @Column({ type: 'simple-json', default: {} })
  checkpoints: Record<string, any>;

  @Column({ default: 'offline' })
  status: string;

  @Column({ name: 'onboarding_status', default: 'incomplete' })
  onboardingStatus: string;

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  currentLocation: Point;

  @Column({ type: 'timestamp', nullable: true })
  lastLocationAt: Date;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalTrips: number;
}
