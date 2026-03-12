// Spec: specs/api/labs.spec.md
import { Service } from 'egg';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/dataSource';
import { LabEntity } from '../entity/Lab';

export interface CreateLabData {
  title: string;
  subtitle: string;
  coverUrl: string;
  duration: string;
  videoUrl: string;
  order?: number;
  isPublished?: boolean;
}

export type UpdateLabData = Partial<CreateLabData>;

export default class LabsService extends Service {
  private get repo(): Repository<LabEntity> {
    return AppDataSource.getRepository(LabEntity);
  }

  async findPublished(page = 1, pageSize = 3) {
    const [list, total] = await this.repo.findAndCount({
      where: { isPublished: true },
      order: { order: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async adminFindAll(page = 1, pageSize = 20) {
    const [list, total] = await this.repo.findAndCount({
      order: { order: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async create(data: CreateLabData): Promise<LabEntity> {
    const entity = this.repo.create({
      ...data,
      order: data.order ?? 0,
      isPublished: data.isPublished ?? false,
    });
    return this.repo.save(entity);
  }

  async update(id: number, data: UpdateLabData): Promise<LabEntity> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      const err = new Error(`Lab #${id} 不存在`);
      (err as unknown as Record<string, unknown>).status = 404;
      throw err;
    }
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      const err = new Error(`Lab #${id} 不存在`);
      (err as unknown as Record<string, unknown>).status = 404;
      throw err;
    }
    await this.repo.remove(entity);
  }
}
