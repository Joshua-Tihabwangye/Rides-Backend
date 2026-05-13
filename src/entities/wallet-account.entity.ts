import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('wallet_accounts')
export class WalletAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ default: 'UGX' })
  currency: string;

  @Column({ type: 'simple-json', default: {} })
  settings: Record<string, any>;

  @UpdateDateColumn()
  updatedAt: Date;
}
