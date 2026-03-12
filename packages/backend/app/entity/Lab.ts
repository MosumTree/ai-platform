// Spec: specs/api/labs.spec.md
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('labs')
export class LabEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  title!: string;

  @Column({ length: 200 })
  subtitle!: string;

  @Column()
  coverUrl!: string;

  @Column({ length: 10 })
  duration!: string;

  @Column()
  videoUrl!: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ default: false })
  isPublished!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
