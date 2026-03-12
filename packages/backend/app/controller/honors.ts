// Spec: specs/api/honors.spec.md
import { Controller } from 'egg';
import HonorsService from '../service/honors';

export default class HonorsController extends Controller {
  async index() {
    const { ctx } = this;
    const svc = (ctx.service as unknown as { honors: HonorsService }).honors;
    ctx.body = await svc.findPublished();
  }
}
