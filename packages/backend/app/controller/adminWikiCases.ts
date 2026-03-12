// Spec: specs/api/wiki-cases.spec.md
// 管理后台 案例百科 CRUD（鉴权暂时关闭，SSO 对接后恢复）
import { Controller } from 'egg';
import WikiCasesService, { CreateWikiCaseData, UpdateWikiCaseData } from '../service/wikiCases';

export default class AdminWikiCasesController extends Controller {
  private get svc(): WikiCasesService {
    return (this.ctx.service as unknown as { wikiCases: WikiCasesService }).wikiCases;
  }

  // GET /api/admin/wiki-cases
  async index() {
    const { ctx } = this;
    const page = Number(ctx.query.page) || 1;
    const pageSize = Number(ctx.query.pageSize) || 20;
    ctx.body = await this.svc.adminFindAll(page, pageSize);
  }

  // POST /api/admin/wiki-cases
  async create() {
    const { ctx } = this;
    const data = ctx.request.body as CreateWikiCaseData;
    if (!data.title || !data.summary || !data.coverUrl || !data.readUrl) {
      ctx.status = 400;
      ctx.body = { code: 400, message: 'title/summary/coverUrl/readUrl 均为必填项', data: null };
      return;
    }
    ctx.status = 201;
    ctx.body = await this.svc.create(data);
  }

  // PUT /api/admin/wiki-cases/:id
  async update() {
    const { ctx } = this;
    const id = Number(ctx.params.id);
    const data = ctx.request.body as UpdateWikiCaseData;
    ctx.body = await this.svc.update(id, data);
  }

  // DELETE /api/admin/wiki-cases/:id
  async destroy() {
    const { ctx } = this;
    const id = Number(ctx.params.id);
    await this.svc.remove(id);
    ctx.body = null;
  }
}
