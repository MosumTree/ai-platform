// Spec: specs/api/auth.spec.md (全模块通用基础设施)
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { DataSource } from 'typeorm';
import { BannerEntity } from '../app/entity/Banner';
import { UserEntity } from '../app/entity/User';
import { AnnouncementEntity } from '../app/entity/Announcement';
import { CourseEntity } from '../app/entity/Course';
import { CapabilityEntity } from '../app/entity/Capability';
import { CaseEntity } from '../app/entity/Case';
import { HonorEntity } from '../app/entity/Honor';
import { ToolGuideEntity } from '../app/entity/ToolGuide';
import { LabEntity } from '../app/entity/Lab';
import { WikiCaseEntity } from '../app/entity/WikiCase';

// 直接读取环境变量，避免模块导入顺序问题
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ai_platform',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    BannerEntity,
    UserEntity,
    AnnouncementEntity,
    CourseEntity,
    CapabilityEntity,
    CaseEntity,
    HonorEntity,
    ToolGuideEntity,
    LabEntity,
    WikiCaseEntity,
  ],
  charset: 'utf8mb4',
  timezone: '+08:00',
});
