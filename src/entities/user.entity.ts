import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'active' })
  status: string; // 'active', 'deleted', 'suspended'

  @Column({ type: 'simple-array', default: '' })
  roles: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true })
  riderId: string;

  @Column({ nullable: true })
  fleetId: string;

  @Column({ nullable: true })
  adminId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];
}
