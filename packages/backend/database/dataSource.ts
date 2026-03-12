// Spec: specs/api/auth.spec.md (全模块通用基础设施)
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { BannerEntity } from '../app/entity/Banner';
import { UserEntity } from '../app/entity/User';
import { AnnouncementEntity } from '../app/entity/Announcement';
import { CourseEntity } from '../app/entity/Course';
import { CapabilityEntity } from '../app/entity/Capability';
import { CaseEntity } from '../app/entity/Case';
import { HonorEntity } from '../app/entity/Honor';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ai_platform',
  entities: [
    BannerEntity,
    UserEntity,
    AnnouncementEntity,
    CourseEntity,
    CapabilityEntity,
    CaseEntity,
    HonorEntity,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  charset: 'utf8mb4',
  timezone: '+08:00',
});
