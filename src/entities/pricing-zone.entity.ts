import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { Polygon } from 'geojson';

@Entity('pricing_zones')
export class PricingZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Polygon', srid: 4326 })
  boundaries: Polygon;

  @Column({ type: 'simple-json', default: {} })
  pricingRules: Record<string, any>;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
