// Spec: specs/api/wiki-cases.spec.md
import { Controller } from 'egg';
import WikiCasesService from '../service/wikiCases';

export default class WikiCasesController extends Controller {
  // GET /api/wiki-cases
  async index() {
    const { ctx } = this;
    const service = ctx.service as unknown as { wikiCases: WikiCasesService };
    const page = Number(ctx.query.page) || 1;
    const pageSize = Number(ctx.query.pageSize) || 3;
    ctx.body = await service.wikiCases.findPublished(page, pageSize);
  }
}
