// Spec: specs/api/weapon-workshop.spec.md
import { Controller } from 'egg';
import WeaponWorkshopService from '../service/weaponWorkshop';

export default class WeaponWorkshopController extends Controller {
  private get svc(): WeaponWorkshopService {
    return (this.ctx.service as any).weaponWorkshop;
  }

  // 门户：获取分类和武器数据
  async index() {
    const { categoryLimit } = this.ctx.query;
    const categories = await this.svc.findAllForPortal(
      categoryLimit ? Number(categoryLimit) : undefined
    );
    this.ctx.body = { categories };
  }

  // 管理：分类列表
  async adminCategories() {
    const { page = 1, pageSize = 20 } = this.ctx.query;
    const result = await this.svc.findCategoriesWithPagination(
      Number(page),
      Number(pageSize)
    );
    this.ctx.body = {
      list: result.list,
      total: result.total,
      page: Number(page),
      pageSize: Number(pageSize),
    };
  }

  // 管理：创建分类
  async createCategory() {
    const data = this.ctx.request.body as any;
    const item = await this.svc.createCategory(data);
    this.ctx.status = 201;
    this.ctx.body = item;
  }

  // 管理：更新分类
  async updateCategory() {
    const id = Number(this.ctx.params.id);
    const data = this.ctx.request.body as any;
    const item = await this.svc.updateCategory(id, data);
    this.ctx.body = item;
  }

  // 管理：删除分类
  async destroyCategory() {
    const id = Number(this.ctx.params.id);
    await this.svc.destroyCategory(id);
    this.ctx.body = null;
  }

  // 管理：获取分类下的武器
  async categoryItems() {
    const categoryId = Number(this.ctx.params.id);
    const items = await this.svc.findItemsByCategory(categoryId);
    this.ctx.body = items;
  }

  // 管理：创建武器
  async createItem() {
    const data = this.ctx.request.body as any;
    const item = await this.svc.createItem(data);
    this.ctx.status = 201;
    this.ctx.body = item;
  }

  // 管理：更新武器
  async updateItem() {
    const id = Number(this.ctx.params.id);
    const data = this.ctx.request.body as any;
    const item = await this.svc.updateItem(id, data);
    this.ctx.body = item;
  }

  // 管理：删除武器
  async destroyItem() {
    const id = Number(this.ctx.params.id);
    await this.svc.destroyItem(id);
    this.ctx.body = null;
  }
}
