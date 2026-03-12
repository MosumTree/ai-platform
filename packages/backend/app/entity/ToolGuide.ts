// Spec: specs/api/tool-guides.spec.md
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tool_guides')
export class ToolGuideEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 300 })
  desc!: string;

  @Column({ length: 50 })
  icon!: string;

  @Column({ length: 30 })
  iconColor!: string;

  @Column()
  installUrl!: string;

  @Column()
  guideUrl!: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
