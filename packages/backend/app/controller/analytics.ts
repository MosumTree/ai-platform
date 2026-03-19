// Spec: specs/api/analytics.spec.md
import { Controller } from 'egg';
import AnalyticsService from '../service/analytics';

export default class AnalyticsController extends Controller {
  private get svc(): AnalyticsService {
    return (this.ctx.service as any).analytics;
  }

  // POST /rest/cbc/aiplatform/analytics/page-view
  async reportPageView() {
    const payload = this.ctx.request.body as {
      path?: string;
      visitorId?: string;
      visitedAt?: string;
    };
    this.ctx.body = await this.svc.reportPageView(this.ctx, {
      path: payload.path || '',
      visitorId: payload.visitorId || '',
      visitedAt: payload.visitedAt,
    });
  }

  // GET /rest/cbc/aiplatform/admin/analytics/overview
  async overview() {
    const { from, to } = this.ctx.query as { from?: string; to?: string };
    this.ctx.body = await this.svc.getOverview(from, to);
  }

  // GET /rest/cbc/aiplatform/analytics/summary
  async summary() {
    this.ctx.body = await this.svc.getSummary();
  }
}
