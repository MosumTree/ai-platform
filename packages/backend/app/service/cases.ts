// Spec: specs/api/cases.spec.md
import { Service } from 'egg';

export default class CasesService extends Service {
  async findPublished(): Promise<null[]> {
    // TODO: 查询已发布优秀案例列表
    return [];
  }
}
