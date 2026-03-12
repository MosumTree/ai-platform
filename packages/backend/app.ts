// Spec: specs/api/auth.spec.md (全模块通用基础设施)
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '.env') });

import type { Application, IBoot } from 'egg';
import { AppDataSource } from './database/dataSource';

export default class AppBootHook implements IBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async willReady() {
    this.app.logger.info('[TypeORM] 正在连接数据库...');
    await AppDataSource.initialize();
    (this.app as unknown as Record<string, unknown>).dataSource = AppDataSource;
    this.app.logger.info('[TypeORM] 数据库连接成功');
  }

  async beforeClose() {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      this.app.logger.info('[TypeORM] 数据库连接已关闭');
    }
  }
}
