// Spec: specs/api/weapon-workshop.spec.md
import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WeaponCategoryEntity } from './WeaponCategory';

@Entity('weapon_items')
export class WeaponItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  categoryId!: number;

  @ManyToOne(() => WeaponCategoryEntity, (category) => category.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category!: WeaponCategoryEntity;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ length: 50, nullable: true })
  icon!: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
