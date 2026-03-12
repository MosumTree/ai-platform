// Spec: specs/api/courses.spec.md
import { Service } from 'egg';

export default class CoursesService extends Service {
  async findPublished(): Promise<null[]> {
    // TODO: 查询已发布课程列表
    return [];
  }
}
