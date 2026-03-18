// Spec: specs/api/ai-trends.spec.md
import { Controller } from 'egg';
import AiTrendsService from '../service/aiTrends';

export default class AiTrendsController extends Controller {
  private get svc(): AiTrendsService {
    return (this.ctx.service as any).aiTrends;
  }

  // 门户：获取列表
  async index() {
    const { limit } = this.ctx.query;
    const list = await this.svc.findAllForPortal(
      limit ? Number(limit) : undefined
    );
    this.ctx.body = list;
  }

  // 管理：获取分页列表
  async adminIndex() {
    const { page = 1, pageSize = 20, keyword } = this.ctx.query;
    const result = await this.svc.findAllWithPagination(
      Number(page),
      Number(pageSize),
      keyword as string
    );
    this.ctx.body = {
      list: result.list,
      total: result.total,
      page: Number(page),
      pageSize: Number(pageSize),
    };
  }

  // 管理：创建
  async create() {
    const data = this.ctx.request.body as any;
    const item = await this.svc.create(data);
    this.ctx.status = 201;
    this.ctx.body = item;
  }

  // 管理：更新
  async update() {
    const id = Number(this.ctx.params.id);
    const data = this.ctx.request.body as any;
    const item = await this.svc.update(id, data);
    this.ctx.body = item;
  }

  // 管理：删除
  async destroy() {
    const id = Number(this.ctx.params.id);
    await this.svc.destroy(id);
    this.ctx.body = null;
  }
}
