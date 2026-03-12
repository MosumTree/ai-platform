// Spec: specs/api/banners.spec.md
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banners')
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({ length: 200, nullable: true })
  description!: string;

  @Column({ nullable: true })
  buttonText!: string;

  @Column({ nullable: true })
  buttonLink!: string;

  @Column()
  imageUrl!: string;

  @Column('simple-json', { nullable: true })
  tags!: string[];

  @Column({ default: 0 })
  order!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
