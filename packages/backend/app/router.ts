// Spec: 全模块路由汇总
import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller, middleware } = app;

  // JWT 解析中间件（所有路由挂载，按需在 controller 内判断）
  const jwt = middleware.jwt();

  // ─── 公开接口 ─────────────────────────────────────────────

  // Banner 轮播（门户）
  router.get('/api/banners', jwt, controller.banners.index);

  // SSO 认证
  router.get('/api/auth/callback', controller.auth.callback);
  router.post('/api/auth/refresh', controller.auth.refresh);

  // 其他门户公开接口（TODO: 详细实现后可补充分页/详情路由）
  router.get('/api/announcements', jwt, controller.announcements.index);
  router.get('/api/courses', jwt, controller.courses.index);
  router.get('/api/capabilities', jwt, controller.capabilities.index);
  router.get('/api/cases', jwt, controller.cases.index);
  router.get('/api/honors', jwt, controller.honors.index);

  // ─── 需要登录的接口 ────────────────────────────────────────

  router.get('/api/auth/me', jwt, controller.auth.me);
  router.post('/api/auth/logout', jwt, controller.auth.logout);

  // ─── 管理后台接口 ─────────────────────────────────────────

  // Dashboard
  router.get('/api/admin/dashboard', jwt, controller.adminDashboard.index);

  // Banner 管理（CRUD，鉴权暂时关闭，SSO 对接后恢复）
  router.get('/api/admin/banners', controller.adminBanners.index);
  router.post('/api/admin/banners', controller.adminBanners.create);
  router.put('/api/admin/banners/:id', controller.adminBanners.update);
  router.del('/api/admin/banners/:id', controller.adminBanners.destroy);
};
