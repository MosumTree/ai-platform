// Spec: specs/admin/dashboard.spec.md
import { Controller } from 'egg';
import DashboardService from '../service/dashboard';

export default class AdminDashboardController extends Controller {
  private get svc(): DashboardService {
    return (this.ctx.service as unknown as { dashboard: DashboardService }).dashboard;
  }

  // GET /api/admin/dashboard - 需要 JWT
  async index() {
    const { ctx } = this;
    const user = ctx.state.user as { id: number } | null;
    if (!user) {
      ctx.status = 401;
      ctx.body = { code: 401, message: '未登录', data: null };
      return;
    }
    const overview = await this.svc.getOverview();
    const recentActivities = await this.svc.getRecentActivities();
    ctx.body = { overview, recentActivities };
  }
}
