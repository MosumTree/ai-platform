// Spec: specs/api/analytics.spec.md
import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('page_visit_logs')
export class PageVisitLogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  path!: string;

  @Column({ length: 64 })
  visitorId!: string;

  @Column({ type: 'datetime' })
  visitedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
