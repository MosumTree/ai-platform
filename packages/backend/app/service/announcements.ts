// Spec: specs/api/announcements.spec.md
import { Service } from 'egg';

export default class AnnouncementsService extends Service {
  async findPublished(): Promise<null[]> {
    // TODO: 查询已发布公告列表
    return [];
  }
}
