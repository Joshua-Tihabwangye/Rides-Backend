import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Point } from 'geojson';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'driver_id' })
  driverId: string;

  @Column({ name: 'fleet_partner_id', nullable: true })
  fleetPartnerId: string;

  @Column({ name: 'fleet_id', nullable: true })
  fleetId: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  licensePlate: string;

  @Column({ type: 'enum', enum: ['sedan', 'suv', 'hatchback', 'van', 'motorcycle', 'bus', 'ambulance'], default: 'sedan' })
  type: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'maintenance', 'retired'], default: 'active' })
  status: string;

  @Column({ type: 'simple-json', default: {} })
  accessories: Record<string, any>;

  @Column({ type: 'simple-json', default: {} })
  documents: Record<string, any>;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  socPercent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedRangeKm: number;

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  currentLocation: Point;

  @Column({ default: false })
  isEv: boolean;
}
