// Spec: specs/api/banners.spec.md
import { Controller } from 'egg';
import BannersService from '../service/banners';

export default class BannersController extends Controller {
  // GET /api/banners - 公开，门户用
  async index() {
    const { ctx } = this;
    const service = ctx.service as unknown as { banners: BannersService };
    ctx.body = await service.banners.findActive();
  }
}
