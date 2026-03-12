// Spec: specs/api/banners.spec.md
// 管理后台 Banner CRUD（鉴权暂时关闭，SSO 对接后恢复）
import { Controller } from 'egg';
import BannersService, { CreateBannerData, UpdateBannerData } from '../service/banners';

export default class AdminBannersController extends Controller {
  private get svc(): BannersService {
    return (this.ctx.service as unknown as { banners: BannersService }).banners;
  }

  // GET /api/admin/banners
  async index() {
    const { ctx } = this;
    const page = Number(ctx.query.page) || 1;
    const pageSize = Number(ctx.query.pageSize) || 20;
    ctx.body = await this.svc.adminFindAll(page, pageSize);
  }

  // POST /api/admin/banners
  async create() {
    const { ctx } = this;
    const data = ctx.request.body as CreateBannerData;

    if (!data.title || !data.imageUrl) {
      ctx.status = 400;
      ctx.body = { code: 400, message: 'title 和 imageUrl 为必填项', data: null };
      return;
    }

    ctx.status = 201;
    ctx.body = await this.svc.create(data);
  }

  // PUT /api/admin/banners/:id
  async update() {
    const { ctx } = this;
    const id = Number(ctx.params.id);
    const data = ctx.request.body as UpdateBannerData;
    ctx.body = await this.svc.update(id, data);
  }

  // DELETE /api/admin/banners/:id
  async destroy() {
    const { ctx } = this;
    const id = Number(ctx.params.id);
    await this.svc.remove(id);
    ctx.body = null;
  }
}
