// Spec: 全模块路由汇总
import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller, middleware } = app;

  const API_PREFIX = '/rest/cbc/aiplatform';

  // JWT 解析中间件（所有路由挂载，按需在 controller 内判断）
  const jwt = middleware.jwt();

  // ─── 公开接口 ─────────────────────────────────────────────

  // 心跳/健康检查（无需鉴权，供负载均衡检测）
  router.get(`${API_PREFIX}/heartbeat`, async (ctx) => {
    ctx.body = { code: 200, message: 'ok', data: { timestamp: Date.now() } };
  });

  // Banner 轮播（门户）
  router.get(`${API_PREFIX}/banners`, jwt, controller.banners.index);

  // 工具指导（门户，公开无需登录）
  router.get(`${API_PREFIX}/tool-guides`, controller.toolGuides.index);

  // 实战实验室（门户，公开无需登录）
  router.get(`${API_PREFIX}/labs`, controller.labs.index);

  // 案例百科（门户，公开无需登录）
  router.get(`${API_PREFIX}/wiki-cases`, controller.wikiCases.index);

  // AI 风向标（门户，公开无需登录）
  router.get(`${API_PREFIX}/ai-trends`, controller.aiTrends.index);

  // 百工武器坊（门户，公开无需登录）
  router.get(`${API_PREFIX}/weapon-workshop`, controller.weaponWorkshop.index);

  // 页面统计（门户访问上报）
  router.post(`${API_PREFIX}/analytics/page-view`, controller.analytics.reportPageView);
  router.get(`${API_PREFIX}/analytics/summary`, controller.analytics.summary);

  // SSO 认证
  router.get(`${API_PREFIX}/auth/callback`, controller.auth.callback);
  router.post(`${API_PREFIX}/auth/refresh`, controller.auth.refresh);

  // 其他门户公开接口（TODO: 详细实现后可补充分页/详情路由）
  router.get(`${API_PREFIX}/announcements`, jwt, controller.announcements.index);
  router.get(`${API_PREFIX}/courses`, jwt, controller.courses.index);
  router.get(`${API_PREFIX}/capabilities`, jwt, controller.capabilities.index);
  router.get(`${API_PREFIX}/cases`, jwt, controller.cases.index);
  router.get(`${API_PREFIX}/honors`, jwt, controller.honors.index);

  // ─── 需要登录的接口 ────────────────────────────────────────

  router.get(`${API_PREFIX}/auth/me`, jwt, controller.auth.me);
  router.post(`${API_PREFIX}/auth/logout`, jwt, controller.auth.logout);

  // ─── 管理后台接口 ─────────────────────────────────────────

  // Dashboard
  router.get(`${API_PREFIX}/admin/dashboard`, jwt, controller.adminDashboard.index);
  router.get(`${API_PREFIX}/admin/analytics/overview`, jwt, controller.analytics.overview);

  // Banner 管理（CRUD，鉴权暂时关闭，SSO 对接后恢复）
  router.get(`${API_PREFIX}/admin/banners`, controller.adminBanners.index);
  router.post(`${API_PREFIX}/admin/banners`, controller.adminBanners.create);
  router.put(`${API_PREFIX}/admin/banners/:id`, controller.adminBanners.update);
  router.del(`${API_PREFIX}/admin/banners/:id`, controller.adminBanners.destroy);

  // 工具指导管理（CRUD，鉴权暂时关闭，SSO 对接后恢复）
  router.get(`${API_PREFIX}/admin/tool-guides`, controller.adminToolGuides.index);
  router.post(`${API_PREFIX}/admin/tool-guides`, controller.adminToolGuides.create);
  router.put(`${API_PREFIX}/admin/tool-guides/:id`, controller.adminToolGuides.update);
  router.del(`${API_PREFIX}/admin/tool-guides/:id`, controller.adminToolGuides.destroy);

  // 实战实验室管理（CRUD，鉴权暂时关闭，SSO 对接后恢复）
  router.get(`${API_PREFIX}/admin/labs`, controller.adminLabs.index);
  router.post(`${API_PREFIX}/admin/labs`, controller.adminLabs.create);
  router.put(`${API_PREFIX}/admin/labs/:id`, controller.adminLabs.update);
  router.del(`${API_PREFIX}/admin/labs/:id`, controller.adminLabs.destroy);

  // 案例百科管理（CRUD，鉴权暂时关闭，SSO 对接后恢复）
  router.get(`${API_PREFIX}/admin/wiki-cases`, controller.adminWikiCases.index);
  router.post(`${API_PREFIX}/admin/wiki-cases`, controller.adminWikiCases.create);
  router.put(`${API_PREFIX}/admin/wiki-cases/:id`, controller.adminWikiCases.update);
  router.del(`${API_PREFIX}/admin/wiki-cases/:id`, controller.adminWikiCases.destroy);

  // AI 风向标管理（CRUD，鉴权暂时关闭）
  router.get(`${API_PREFIX}/admin/ai-trends`, controller.aiTrends.adminIndex);
  router.post(`${API_PREFIX}/admin/ai-trends`, controller.aiTrends.create);
  router.put(`${API_PREFIX}/admin/ai-trends/:id`, controller.aiTrends.update);
  router.del(`${API_PREFIX}/admin/ai-trends/:id`, controller.aiTrends.destroy);

  // 百工武器坊管理（CRUD，鉴权暂时关闭）
  // 分类管理
  router.get(`${API_PREFIX}/admin/weapon-categories`, controller.weaponWorkshop.adminCategories);
  router.post(`${API_PREFIX}/admin/weapon-categories`, controller.weaponWorkshop.createCategory);
  router.put(`${API_PREFIX}/admin/weapon-categories/:id`, controller.weaponWorkshop.updateCategory);
  router.del(`${API_PREFIX}/admin/weapon-categories/:id`, controller.weaponWorkshop.destroyCategory);
  router.get(`${API_PREFIX}/admin/weapon-categories/:id/items`, controller.weaponWorkshop.categoryItems);
  // 武器项管理
  router.post(`${API_PREFIX}/admin/weapon-items`, controller.weaponWorkshop.createItem);
  router.put(`${API_PREFIX}/admin/weapon-items/:id`, controller.weaponWorkshop.updateItem);
  router.del(`${API_PREFIX}/admin/weapon-items/:id`, controller.weaponWorkshop.destroyItem);
};
