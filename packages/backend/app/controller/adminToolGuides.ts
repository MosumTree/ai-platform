// Spec: specs/api/tool-guides.spec.md
// 管理后台工具指导 CRUD（鉴权暂时关闭，SSO 对接后恢复）
import { Controller } from 'egg';
import ToolGuidesService, { CreateToolGuideData, UpdateToolGuideData } from '../service/toolGuides';

export default class AdminToolGuidesController extends Controller {
  private get svc(): ToolGuidesService {
    return (this.ctx.service as unknown as { toolGuides: ToolGuidesService }).toolGuides;
  }

  // GET /api/admin/tool-guides
  async index() {
    const { ctx } = this;
    const page = Number(ctx.query.page) || 1;
    const pageSize = Number(ctx.query.pageSize) || 20;
    ctx.body = await this.svc.adminFindAll(page, pageSize);
  }

  // POST /api/admin/tool-guides
  async create() {
    const { ctx } = this;
    const data = ctx.request.body as CreateToolGuideData;

    if (!data.name || !data.desc || !data.icon || !data.iconColor || !data.installUrl || !data.guideUrl) {
      ctx.status = 400;
      ctx.body = { code: 400, message: 'name/desc/icon/iconColor/installUrl/guideUrl 均为必填项', data: null };
      return;
    }

    ctx.status = 201;
    ctx.body = await this.svc.create(data);
  }

  // PUT /api/admin/tool-guides/:id
  async update() {
    const { ctx } = this;
    const id = Number(ctx.params.id);
    const data = ctx.request.body as UpdateToolGuideData;
    ctx.body = await this.svc.update(id, data);
  }

  // DELETE /api/admin/tool-guides/:id
  async destroy() {
    const { ctx } = this;
    const id = Number(ctx.params.id);
    await this.svc.remove(id);
    ctx.body = null;
  }
}
