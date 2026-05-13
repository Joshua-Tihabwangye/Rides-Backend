import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('delivery_routes')
export class DeliveryRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'driver_id' })
  driverId: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ type: 'enum', enum: ['pending', 'pickup_confirmed', 'qr_verified', 'in_progress', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ type: 'simple-json' })
  stops: Record<string, any>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
