// Spec: specs/api/tool-guides.spec.md
import { Controller } from 'egg';
import ToolGuidesService from '../service/toolGuides';

export default class ToolGuidesController extends Controller {
  // GET /api/tool-guides - 公开，门户用
  async index() {
    const { ctx } = this;
    const service = ctx.service as unknown as { toolGuides: ToolGuidesService };
    ctx.body = await service.toolGuides.findActive();
  }
}
