import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('earnings_ledger')
export class EarningsLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @Column({ type: 'enum', enum: ['trip_fare', 'bonus', 'tip', 'penalty', 'adjustment', 'delivery_fare'], default: 'trip_fare' })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'trip_id', nullable: true })
  tripId: string;

  @Column({ name: 'delivery_order_id', nullable: true })
  deliveryOrderId: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
