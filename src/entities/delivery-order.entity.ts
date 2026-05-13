import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('delivery_orders')
export class DeliveryOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rider_id' })
  riderId: string;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @Column({ name: 'route_id', nullable: true })
  routeId: string;

  @Column({ type: 'enum', enum: ['draft', 'requested', 'accepted', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed'], default: 'draft' })
  status: string;

  @Column({ type: 'simple-json' })
  pickup: Record<string, any>;

  @Column({ type: 'simple-json' })
  dropoff: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  items: Record<string, any>[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fare: number;

  @Column({ nullable: true })
  qrCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
