// Spec: specs/api/tool-guides.spec.md
import { Service } from 'egg';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/dataSource';
import { ToolGuideEntity } from '../entity/ToolGuide';

export interface CreateToolGuideData {
  name: string;
  desc: string;
  icon: string;
  iconColor: string;
  installUrl: string;
  guideUrl: string;
  order?: number;
  isActive?: boolean;
}

export type UpdateToolGuideData = Partial<CreateToolGuideData>;

export default class ToolGuidesService extends Service {
  private get repo(): Repository<ToolGuideEntity> {
    return AppDataSource.getRepository(ToolGuideEntity);
  }

  async findActive(): Promise<ToolGuideEntity[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
  }

  async adminFindAll(page = 1, pageSize = 20) {
    const [list, total] = await this.repo.findAndCount({
      order: { order: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async create(data: CreateToolGuideData): Promise<ToolGuideEntity> {
    const entity = this.repo.create({
      ...data,
      order: data.order ?? 0,
      isActive: data.isActive ?? true,
    });
    return this.repo.save(entity);
  }

  async update(id: number, data: UpdateToolGuideData): Promise<ToolGuideEntity> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      const err = new Error(`ToolGuide #${id} 不存在`);
      (err as unknown as Record<string, unknown>).status = 404;
      throw err;
    }
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      const err = new Error(`ToolGuide #${id} 不存在`);
      (err as unknown as Record<string, unknown>).status = 404;
      throw err;
    }
    await this.repo.remove(entity);
  }
}
