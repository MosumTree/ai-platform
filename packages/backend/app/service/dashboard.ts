// Spec: specs/admin/dashboard.spec.md
import { Service } from 'egg';

export default class DashboardService extends Service {
  async getOverview(): Promise<null> {
    // TODO: 查询五个模块的统计数据（总数、已发布/active 数量）
    return null;
  }

  async getRecentActivities(): Promise<null> {
    // TODO: 查询最近 10 条操作记录
    return null;
  }
}
