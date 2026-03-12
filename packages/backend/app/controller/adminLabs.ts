// Spec: specs/api/labs.spec.md
// 管理后台 实战实验室 CRUD（鉴权暂时关闭，SSO 对接后恢复）
import { Controller } from 'egg';
import LabsService, { CreateLabData, UpdateLabData } from '../service/labs';

export default class AdminLabsController extends Controller {
  private get svc(): LabsService {
    return (this.ctx.service as unknown as { labs: LabsService }).labs;
  }

  // GET /api/admin/labs
  async index() {
    const { ctx } = this;
    const page = Number(ctx.query.page) || 1;
    const pageSize = Number(ctx.query.pageSize) || 20;
    ctx.body = await this.svc.adminFindAll(page, pageSize);
  }

  // POST /api/admin/labs
  async create() {
    const { ctx } = this;
    const data = ctx.request.body as CreateLabData;
    if (!data.title || !data.subtitle || !data.coverUrl || !data.duration || !data.videoUrl) {
      ctx.status = 400;
      ctx.body = { code: 400, message: 'title/subtitle/coverUrl/duration/videoUrl 均为必填项', data: null };
      return;
    }
    ctx.status = 201;
    ctx.body = await this.svc.create(data);
  }

  // PUT /api/admin/labs/:id
  async update() {
    const { ctx } = this;
    const id = Number(ctx.params.id);
    const data = ctx.request.body as UpdateLabData;
    ctx.body = await this.svc.update(id, data);
  }

  // DELETE /api/admin/labs/:id
  async destroy() {
    const { ctx } = this;
    const id = Number(ctx.params.id);
    await this.svc.remove(id);
    ctx.body = null;
  }
}
