// Spec: specs/api/banners.spec.md
import { Service } from 'egg';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/dataSource';
import { BannerEntity } from '../entity/Banner';

export interface CreateBannerData {
  title: string;
  imageUrl: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  tags?: string[];
  order?: number;
  isActive?: boolean;
}

export type UpdateBannerData = Partial<CreateBannerData>;

export default class BannersService extends Service {
  private get repo(): Repository<BannerEntity> {
    return AppDataSource.getRepository(BannerEntity);
  }

  async findActive(): Promise<BannerEntity[]> {
    const list = await this.repo.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
    return list.map(b => ({ ...b, tags: b.tags ?? [] }));
  }

  async adminFindAll(page = 1, pageSize = 20) {
    const [raw, total] = await this.repo.findAndCount({
      order: { order: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const list = raw.map(b => ({ ...b, tags: b.tags ?? [] }));
    return { list, total, page, pageSize };
  }

  async create(data: CreateBannerData): Promise<BannerEntity> {
    const banner = this.repo.create({
      ...data,
      tags: data.tags ?? [],
      order: data.order ?? 0,
      isActive: data.isActive ?? true,
    });
    return this.repo.save(banner);
  }

  async update(id: number, data: UpdateBannerData): Promise<BannerEntity> {
    const banner = await this.repo.findOneBy({ id });
    if (!banner) {
      const err = new Error(`Banner #${id} 不存在`);
      (err as unknown as Record<string, unknown>).status = 404;
      throw err;
    }
    Object.assign(banner, data);
    return this.repo.save(banner);
  }

  async remove(id: number): Promise<void> {
    const banner = await this.repo.findOneBy({ id });
    if (!banner) {
      const err = new Error(`Banner #${id} 不存在`);
      (err as unknown as Record<string, unknown>).status = 404;
      throw err;
    }
    await this.repo.remove(banner);
  }
}
