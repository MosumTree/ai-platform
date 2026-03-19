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
    // Spec: specs/api/analytics.spec.md
    // 生产环境默认关闭 synchronize，这里兜底确保统计表存在
    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS page_visit_logs (
        id INT NOT NULL AUTO_INCREMENT,
        path VARCHAR(255) NOT NULL,
        visitorId VARCHAR(64) NOT NULL,
        visitedAt DATETIME NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_page_visit_logs_path (path),
        INDEX idx_page_visit_logs_visitorId (visitorId),
        INDEX idx_page_visit_logs_visitedAt (visitedAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
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
