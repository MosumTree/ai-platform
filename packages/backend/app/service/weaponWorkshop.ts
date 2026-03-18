// Spec: specs/api/weapon-workshop.spec.md
import { Service } from 'egg';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/dataSource';
import { WeaponCategoryEntity } from '../entity/WeaponCategory';
import { WeaponItemEntity } from '../entity/WeaponItem';

export interface CreateCategoryData {
  name: string;
  icon?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  icon?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateWeaponItemData {
  categoryId: number;
  name: string;
  description: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateWeaponItemData {
  categoryId?: number;
  name?: string;
  description?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export default class WeaponWorkshopService extends Service {
  private get categoryRepo(): Repository<WeaponCategoryEntity> {
    return AppDataSource.getRepository(WeaponCategoryEntity);
  }

  private get itemRepo(): Repository<WeaponItemEntity> {
    return AppDataSource.getRepository(WeaponItemEntity);
  }

  // 门户：获取分类和武器数据（嵌套）
  async findAllForPortal(
    categoryLimit?: number
  ): Promise<WeaponCategoryEntity[]> {
    const qb = this.categoryRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.items', 'items')
      .where('c.isActive = :isActive', { isActive: true })
      .andWhere('items.isActive = :itemActive', { itemActive: true })
      .orderBy('c.order', 'ASC')
      .addOrderBy('items.order', 'ASC');

    if (categoryLimit) {
      qb.limit(categoryLimit);
    }

    return qb.getMany();
  }

  // 管理：分类分页
  async findCategoriesWithPagination(
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ list: WeaponCategoryEntity[]; total: number }> {
    const [list, total] = await this.categoryRepo.findAndCount({
      order: { order: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total };
  }

  // 管理：创建分类
  async createCategory(data: CreateCategoryData): Promise<WeaponCategoryEntity> {
    const entity = this.categoryRepo.create({
      ...data,
      icon: data.icon || 'construction',
      order: data.order ?? 0,
      isActive: data.isActive ?? true,
    });
    return this.categoryRepo.save(entity);
  }

  // 管理：更新分类
  async updateCategory(
    id: number,
    data: UpdateCategoryData
  ): Promise<WeaponCategoryEntity> {
    const item = await this.categoryRepo.findOneBy({ id });
    if (!item) {
      const err = new Error(`武器分类 #${id} 不存在`);
      (err as any).status = 404;
      throw err;
    }
    Object.assign(item, data);
    return this.categoryRepo.save(item);
  }

  // 管理：删除分类（级联删除武器）
  async destroyCategory(id: number): Promise<void> {
    const item = await this.categoryRepo.findOneBy({ id });
    if (!item) {
      const err = new Error(`武器分类 #${id} 不存在`);
      (err as any).status = 404;
      throw err;
    }
    await this.categoryRepo.remove(item);
  }

  // 管理：获取分类下的武器列表
  async findItemsByCategory(categoryId: number): Promise<WeaponItemEntity[]> {
    return this.itemRepo.find({
      where: { categoryId },
      order: { order: 'ASC' },
    });
  }

  // 管理：创建武器
  async createItem(data: CreateWeaponItemData): Promise<WeaponItemEntity> {
    const entity = this.itemRepo.create({
      ...data,
      order: data.order ?? 0,
      isActive: data.isActive ?? true,
    });
    return this.itemRepo.save(entity);
  }

  // 管理：更新武器
  async updateItem(
    id: number,
    data: UpdateWeaponItemData
  ): Promise<WeaponItemEntity> {
    const item = await this.itemRepo.findOneBy({ id });
    if (!item) {
      const err = new Error(`武器项 #${id} 不存在`);
      (err as any).status = 404;
      throw err;
    }
    Object.assign(item, data);
    return this.itemRepo.save(item);
  }

  // 管理：删除武器
  async destroyItem(id: number): Promise<void> {
    const item = await this.itemRepo.findOneBy({ id });
    if (!item) {
      const err = new Error(`武器项 #${id} 不存在`);
      (err as any).status = 404;
      throw err;
    }
    await this.itemRepo.remove(item);
  }
}
