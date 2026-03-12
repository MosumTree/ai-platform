// Spec: specs/api/announcements.spec.md
import { Controller } from 'egg';
import AnnouncementsService from '../service/announcements';

export default class AnnouncementsController extends Controller {
  async index() {
    const { ctx } = this;
    const svc = (ctx.service as unknown as { announcements: AnnouncementsService }).announcements;
    ctx.body = await svc.findPublished();
  }
}
