// Spec: specs/api/ai-trends.spec.md
import { Service } from 'egg';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/dataSource';
import { AiTrendEntity } from '../entity/AiTrend';

export interface CreateAiTrendData {
  title: string;
  summary: string;
  icon?: string;
  source: string;
  sourceUrl: string;
  publishDate?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateAiTrendData {
  title?: string;
  summary?: string;
  icon?: string;
  source?: string;
  sourceUrl?: string;
  publishDate?: string;
  order?: number;
  isActive?: boolean;
}

export default class AiTrendsService extends Service {
  private get repo(): Repository<AiTrendEntity> {
    return AppDataSource.getRepository(AiTrendEntity);
  }

  // 门户：获取列表（公开）
  async findAllForPortal(limit?: number): Promise<AiTrendEntity[]> {
    const qb = this.repo.createQueryBuilder('t')
      .where('t.isActive = :isActive', { isActive: true })
      .orderBy('t.order', 'ASC')
      .addOrderBy('t.publishDate', 'DESC');

    if (limit) {
      qb.limit(limit);
    }

    return qb.getMany();
  }

  // 管理：分页查询
  async findAllWithPagination(
    page: number = 1,
    pageSize: number = 20,
    keyword?: string
  ): Promise<{ list: AiTrendEntity[]; total: number }> {
    const qb = this.repo.createQueryBuilder('t');

    if (keyword) {
      qb.where('t.title LIKE :keyword OR t.summary LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    const [list, total] = await qb
      .orderBy('t.order', 'ASC')
      .addOrderBy('t.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total };
  }

  // 创建
  async create(data: CreateAiTrendData): Promise<AiTrendEntity> {
    const entity = this.repo.create({
      ...data,
      icon: data.icon || 'bolt',
      publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
      order: data.order ?? 0,
      isActive: data.isActive ?? true,
    });
    return this.repo.save(entity);
  }

  // 更新
  async update(id: number, data: UpdateAiTrendData): Promise<AiTrendEntity> {
    const item = await this.repo.findOneBy({ id });
    if (!item) {
      const err = new Error(`AI 风向标 #${id} 不存在`);
      (err as any).status = 404;
      throw err;
    }

    Object.assign(item, {
      ...data,
      publishDate: data.publishDate ? new Date(data.publishDate) : item.publishDate,
    });

    return this.repo.save(item);
  }

  // 删除
  async destroy(id: number): Promise<void> {
    const item = await this.repo.findOneBy({ id });
    if (!item) {
      const err = new Error(`AI 风向标 #${id} 不存在`);
      (err as any).status = 404;
      throw err;
    }
    await this.repo.remove(item);
  }
}
