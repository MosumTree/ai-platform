// Spec: specs/api/labs.spec.md
import { Controller } from 'egg';
import LabsService from '../service/labs';

export default class LabsController extends Controller {
  // GET /api/labs
  async index() {
    const { ctx } = this;
    const service = ctx.service as unknown as { labs: LabsService };
    const page = Number(ctx.query.page) || 1;
    const pageSize = Number(ctx.query.pageSize) || 3;
    ctx.body = await service.labs.findPublished(page, pageSize);
  }
}
