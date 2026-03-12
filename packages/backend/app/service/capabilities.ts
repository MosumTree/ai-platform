// Spec: specs/api/capability-market.spec.md
import { Service } from 'egg';

export default class CapabilitiesService extends Service {
  async findPublished(): Promise<null[]> {
    // TODO: 查询已发布能力列表
    return [];
  }
}
