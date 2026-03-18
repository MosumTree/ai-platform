// Spec: specs/api/auth.spec.md
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../shared';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  ssoId!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  avatar!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Viewer,
  })
  role!: UserRole;

  @Column('simple-json', { nullable: true })
  permissions!: string[];

  @Column({ nullable: true })
  refreshToken!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
