// Spec: specs/api/wiki-cases.spec.md
import { Service } from 'egg';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/dataSource';
import { WikiCaseEntity } from '../entity/WikiCase';

export interface CreateWikiCaseData {
  title: string;
  summary: string;
  coverUrl: string;
  readUrl: string;
  tags?: string[];
  order?: number;
  isPublished?: boolean;
}

export type UpdateWikiCaseData = Partial<CreateWikiCaseData>;

export default class WikiCasesService extends Service {
  private get repo(): Repository<WikiCaseEntity> {
    return AppDataSource.getRepository(WikiCaseEntity);
  }

  async findPublished(page = 1, pageSize = 3) {
    const [raw, total] = await this.repo.findAndCount({
      where: { isPublished: true },
      order: { order: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const list = raw.map(c => ({ ...c, tags: c.tags ?? [] }));
    return { list, total, page, pageSize };
  }

  async adminFindAll(page = 1, pageSize = 20) {
    const [raw, total] = await this.repo.findAndCount({
      order: { order: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const list = raw.map(c => ({ ...c, tags: c.tags ?? [] }));
    return { list, total, page, pageSize };
  }

  async create(data: CreateWikiCaseData): Promise<WikiCaseEntity> {
    const entity = this.repo.create({
      ...data,
      tags: data.tags ?? [],
      order: data.order ?? 0,
      isPublished: data.isPublished ?? false,
    });
    return this.repo.save(entity);
  }

  async update(id: number, data: UpdateWikiCaseData): Promise<WikiCaseEntity> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      const err = new Error(`WikiCase #${id} 不存在`);
      (err as unknown as Record<string, unknown>).status = 404;
      throw err;
    }
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      const err = new Error(`WikiCase #${id} 不存在`);
      (err as unknown as Record<string, unknown>).status = 404;
      throw err;
    }
    await this.repo.remove(entity);
  }
}
