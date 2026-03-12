// Spec: specs/api/wiki-cases.spec.md
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wiki_cases')
export class WikiCaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  title!: string;

  @Column({ length: 300 })
  summary!: string;

  @Column()
  coverUrl!: string;

  @Column('simple-json', { nullable: true })
  tags!: string[];

  @Column()
  readUrl!: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ default: false })
  isPublished!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
