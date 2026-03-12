// Spec: specs/api/honors.spec.md
import { Service } from 'egg';

export default class HonorsService extends Service {
  async findPublished(): Promise<null[]> {
    // TODO: 查询已发布荣誉激励列表
    return [];
  }
}
