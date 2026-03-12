// Spec: specs/api/cases.spec.md
import { Controller } from 'egg';
import CasesService from '../service/cases';

export default class CasesController extends Controller {
  async index() {
    const { ctx } = this;
    const svc = (ctx.service as unknown as { cases: CasesService }).cases;
    ctx.body = await svc.findPublished();
  }
}
