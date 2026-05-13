import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('documents')
export class UserDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  userType: string; // 'driver', 'rider', 'fleet', 'admin'

  @Column()
  documentType: string;

  @Column()
  fileUrl: string;

  @Column({ type: 'date' })
  expiryDate: string;

  @Column({ default: 'under_review' })
  status: string; // 'under_review', 'verified', 'rejected'

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}