// Spec: specs/api/courses.spec.md
import { Controller } from 'egg';
import CoursesService from '../service/courses';

export default class CoursesController extends Controller {
  async index() {
    const { ctx } = this;
    const svc = (ctx.service as unknown as { courses: CoursesService }).courses;
    ctx.body = await svc.findPublished();
  }
}
