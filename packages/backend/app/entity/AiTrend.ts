// Spec: specs/api/ai-trends.spec.md
import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ai_trends')
export class AiTrendEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ length: 50, default: 'bolt' })
  icon!: string;

  @Column({ length: 100 })
  source!: string;

  @Column({ length: 500 })
  sourceUrl!: string;

  @Column({ type: 'date' })
  publishDate!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: 0 })
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
