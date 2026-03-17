// Spec: specs/api/auth.spec.md (全模块通用基础设施)
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dbConfig } from '../config/config.default';
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

export const AppDataSource = new DataSource({
  type: 'mysql',
  ...dbConfig,
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
