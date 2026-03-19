// Spec: specs/api/analytics.spec.md
import { Service, Context } from 'egg';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/dataSource';
import { PageVisitLogEntity } from '../entity/PageVisitLog';

export interface ReportPageViewData {
  path: string;
  visitorId: string;
  visitedAt?: string;
}

export default class AnalyticsService extends Service {
  private get repo(): Repository<PageVisitLogEntity> {
    return AppDataSource.getRepository(PageVisitLogEntity);
  }

  private isLocalDebugRequest(ctx: Context): boolean {
    const values = [
      ctx.get('Origin'),
      ctx.get('Referer'),
      ctx.get('Host'),
      ctx.get('X-Forwarded-Host'),
    ].filter(Boolean);

    const isLocalHost = (host: string): boolean => {
      const normalized = host.toLowerCase();
      return normalized.includes('localhost')
        || normalized.includes('127.0.0.1')
        || normalized.includes('0.0.0.0')
        || normalized.includes('::1');
    };

    return values.some((value) => {
      try {
        // Origin / Referer 通常是完整 URL
        const url = new URL(value);
        return isLocalHost(url.host);
      } catch {
        // Host / X-Forwarded-Host 通常是 host:port
        return isLocalHost(value);
      }
    });
  }

  async reportPageView(ctx: Context, payload: ReportPageViewData): Promise<{ accepted: boolean }> {
    if (this.isLocalDebugRequest(ctx)) {
      return { accepted: false };
    }

    const path = (payload.path || '').trim();
    const visitorId = (payload.visitorId || '').trim();

    if (!path) {
      ctx.throw(400, 'path 不能为空');
    }
    if (!visitorId) {
      ctx.throw(400, 'visitorId 不能为空');
    }

    const visitedAt = payload.visitedAt ? new Date(payload.visitedAt) : new Date();
    if (Number.isNaN(visitedAt.getTime())) {
      ctx.throw(400, 'visitedAt 格式不正确');
    }

    const entity = this.repo.create({
      path: path.slice(0, 255),
      visitorId: visitorId.slice(0, 64),
      visitedAt,
    });
    await this.repo.save(entity);
    return { accepted: true };
  }

  async getOverview(from?: string, to?: string): Promise<{
    range: { from: string; to: string };
    totals: { pageViews: number; visitors: number };
    byPath: Array<{ path: string; pageViews: number; visitors: number }>;
  }> {
    const now = new Date();
    const end = to ? new Date(to) : new Date(now);
    end.setHours(23, 59, 59, 999);

    const start = from ? new Date(from) : new Date(now);
    if (!from) {
      start.setDate(start.getDate() - 6);
    }
    start.setHours(0, 0, 0, 0);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      const err = new Error('from/to 日期格式不正确');
      (err as any).status = 400;
      throw err;
    }

    const totalRaw = await this.repo.createQueryBuilder('v')
      .select('COUNT(*)', 'pageViews')
      .addSelect('COUNT(DISTINCT v.visitorId)', 'visitors')
      .where('v.visitedAt BETWEEN :start AND :end', { start, end })
      .getRawOne<{ pageViews: string; visitors: string }>();

    const byPathRaw = await this.repo.createQueryBuilder('v')
      .select('v.path', 'path')
      .addSelect('COUNT(*)', 'pageViews')
      .addSelect('COUNT(DISTINCT v.visitorId)', 'visitors')
      .where('v.visitedAt BETWEEN :start AND :end', { start, end })
      .groupBy('v.path')
      .orderBy('pageViews', 'DESC')
      .getRawMany<{ path: string; pageViews: string; visitors: string }>();

    return {
      range: {
        from: start.toISOString(),
        to: end.toISOString(),
      },
      totals: {
        pageViews: Number(totalRaw?.pageViews || 0),
        visitors: Number(totalRaw?.visitors || 0),
      },
      byPath: byPathRaw.map((item) => ({
        path: item.path,
        pageViews: Number(item.pageViews || 0),
        visitors: Number(item.visitors || 0),
      })),
    };
  }

  async getSummary(): Promise<{
    totals: { pageViews: number; visitors: number };
  }> {
    const totalRaw = await this.repo.createQueryBuilder('v')
      .select('COUNT(*)', 'pageViews')
      .addSelect('COUNT(DISTINCT v.visitorId)', 'visitors')
      .getRawOne<{ pageViews: string; visitors: string }>();

    return {
      totals: {
        pageViews: Number(totalRaw?.pageViews || 0),
        visitors: Number(totalRaw?.visitors || 0),
      },
    };
  }
}
