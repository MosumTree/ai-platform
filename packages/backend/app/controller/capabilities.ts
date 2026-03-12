// Spec: specs/api/capability-market.spec.md
import { Controller } from 'egg';
import CapabilitiesService from '../service/capabilities';

export default class CapabilitiesController extends Controller {
  async index() {
    const { ctx } = this;
    const svc = (ctx.service as unknown as { capabilities: CapabilitiesService }).capabilities;
    ctx.body = await svc.findPublished();
  }
}
