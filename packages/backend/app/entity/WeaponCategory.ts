// Spec: specs/api/weapon-workshop.spec.md
import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
// 延迟加载函数，用于解决循环依赖
const getWeaponItemEntity = () => require('./WeaponItem').WeaponItemEntity;

@Entity('weapon_categories')
export class WeaponCategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 50, default: 'construction' })
  icon!: string;

  @Column({ length: 200, nullable: true })
  description!: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => getWeaponItemEntity(), (item: any) => item.category, { cascade: true })
  items!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
